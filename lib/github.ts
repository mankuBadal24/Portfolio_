import "server-only";
import { Repo, ReposQuery, ReposResponse, PinnedResponse, RateInfo } from "./types";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const API_GQL = "https://api.github.com/graphql";
const API_REST = "https://api.github.com";

function requireToken() {
  if (!GITHUB_TOKEN) {
    throw new Error(
      "GITHUB_TOKEN is not set. Create a PAT with read-only scopes (read:user, public_repo)."
    );
  }
}

function rateInfoFromHeaders(h: Headers): RateInfo {
  return {
    limit: h.has("x-ratelimit-limit") ? Number(h.get("x-ratelimit-limit")) : undefined,
    remaining: h.has("x-ratelimit-remaining") ? Number(h.get("x-ratelimit-remaining")) : undefined,
    reset: h.has("x-ratelimit-reset") ? Number(h.get("x-ratelimit-reset")) : undefined
  };
}

/** GraphQL fetch (server-only) */
async function gql<T>(query: string, variables: Record<string, any>): Promise<{
  data?: T;
  errors?: any;
  headers: Headers;
}> {
  requireToken();
  const res = await fetch(API_GQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables }),
    // near real-time but still cached server-side
    next: { revalidate: 60 }
  });

  const headers = res.headers;
  const json = (await res.json()) as { data?: T; errors?: any };
  return { ...json, headers };
}

/** REST fetch (server-only) — fallback */
async function rest<T>(path: string, init?: RequestInit) {
  const res = await fetch(`${API_REST}${path}`, {
    headers: {
      ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
      "Content-Type": "application/json",
      "User-Agent": "mayank-portfolio"
    },
    next: { revalidate: 60 },
    ...init
  });
  const headers = res.headers;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub REST error ${res.status}: ${text}`);
  }
  const data = (await res.json()) as T;
  return { data, headers };
}

/** Map GraphQL repo node -> Repo */
function mapGqlRepo(node: any): Repo {
  return {
    id: node.id,
    name: node.name,
    description: node.description,
    stargazerCount: node.stargazerCount,
    forkCount: node.forkCount,
    primaryLanguage: node.primaryLanguage
      ? { name: node.primaryLanguage.name, color: node.primaryLanguage.color }
      : null,
    languages:
      node.languages?.nodes?.map((l: any) => ({ name: l.name, color: l.color }))?.slice(0, 5) ??
      [],
    topics: node.repositoryTopics?.nodes?.map((t: any) => t.topic.name) ?? [],
    updatedAt: node.updatedAt,
    homepageUrl: node.homepageUrl,
    htmlUrl: node.url,
    openGraphImageUrl: node.openGraphImageUrl,
    owner: { login: node.owner.login },
    visibility: node.visibility
  };
}

/** Map REST repo -> Repo  */
function mapRestRepo(r: any): Repo {
  return {
    id: String(r.id),
    name: r.name,
    description: r.description,
    stargazerCount: r.stargazers_count,
    forkCount: r.forks_count,
    primaryLanguage: r.language ? { name: r.language, color: null } : null,
    languages: [], // separate call would be required; we keep minimal for fallback
    topics: r.topics ?? [],
    updatedAt: r.updated_at,
    homepageUrl: r.homepage ?? r.homepage_url ?? null,
    htmlUrl: r.html_url,
    openGraphImageUrl: r.owner?.avatar_url ?? null,
    owner: { login: r.owner?.login ?? "" },
    visibility: r.private ? "PRIVATE" : "PUBLIC"
  };
}

/** Get pinned (featured) repos via GraphQL. If GraphQL fails, return empty with reason. */
export async function getPinned(username: string): Promise<PinnedResponse> {
  try {
    const query = /* GraphQL */ `
      query($login: String!) {
        user(login: $login) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                id
                name
                description
                stargazerCount
                forkCount
                primaryLanguage { name color }
                languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
                  nodes { name color }
                }
                repositoryTopics(first: 10) {
                  nodes { topic { name } }
                }
                updatedAt
                homepageUrl
                url
                openGraphImageUrl
                owner { login }
                visibility
              }
            }
          }
        }
        rateLimit { limit remaining resetAt }
      }
    `;
    const { data, errors, headers } = await gql<{
      user: { pinnedItems: { nodes: any[] } } | null;
      rateLimit: { limit: number; remaining: number; resetAt: string };
    }>(query, { login: username });

    const rate: RateInfo = {
      limit: data?.rateLimit?.limit,
      remaining: data?.rateLimit?.remaining,
      reset: data?.rateLimit?.resetAt ? Math.floor(new Date(data.rateLimit.resetAt).getTime() / 1000) : undefined
    };

    if (errors || !data?.user) {
      return { ok: false, reason: "GraphQL unavailable or user not found", data: [], rate };
    }

    const repos = (data.user.pinnedItems.nodes || []).map(mapGqlRepo);
    return { ok: true, data: repos, rate };
  } catch (e: any) {
    return { ok: false, reason: e?.message || "GraphQL error", data: [] };
  }
}

/** Get recent public repos via GraphQL, fallback to REST on error. */
export async function getRepos(params: ReposQuery): Promise<ReposResponse> {
  const { username, cursor, perPage = 12, sort = "updated", language, q } = params;

  // GraphQL path
  try {
    const orderBy =
      sort === "stars"
        ? "{ field: STARGAZERS, direction: DESC }"
        : "{ field: UPDATED_AT, direction: DESC }";

    const after = cursor ? `, after: "${cursor}"` : "";
    const langFilter = language
      ? `, languages: { nodes: { name: "${language.replace(/"/g, "")}" } }`
      : "";
    // For search text, we filter client-side as GitHub GraphQL requires search API; keep it simple.

    const query = /* GraphQL */ `
      query($login: String!, $first: Int!) {
        user(login: $login) {
          repositories(privacy: PUBLIC, isFork: false, ownerAffiliations: OWNER, first: $first ${after}, orderBy: ${orderBy}) {
            nodes {
              id
              name
              description
              stargazerCount
              forkCount
              primaryLanguage { name color }
              languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
                nodes { name color }
              }
              repositoryTopics(first: 10) { nodes { topic { name } } }
              updatedAt
              homepageUrl
              url
              openGraphImageUrl
              owner { login }
              visibility
            }
            pageInfo { hasNextPage endCursor }
          }
        }
        rateLimit { limit remaining resetAt }
      }
    `;
    const { data, errors, headers } = await gql<any>(query, {
      login: username,
      first: perPage
    });

    if (errors || !data?.user?.repositories) throw new Error("GraphQL query failed");
    let repos: Repo[] = data.user.repositories.nodes.map(mapGqlRepo);

    // Client-like filter for language/q (server-side prefilter to reduce payload)
    if (language) {
      repos = repos.filter(
        (r) =>
          r.primaryLanguage?.name.toLowerCase() === language.toLowerCase() ||
          r.languages?.some((l) => l.name.toLowerCase() === language.toLowerCase())
      );
    }
    if (q) {
      const t = q.toLowerCase();
      repos = repos.filter(
        (r) =>
          r.name.toLowerCase().includes(t) ||
          (r.description ?? "").toLowerCase().includes(t) ||
          (r.topics ?? []).some((topic) => topic.toLowerCase().includes(t))
      );
    }

    return {
      ok: true,
      data: repos,
      pageInfo: {
        hasNextPage: Boolean(data.user.repositories.pageInfo.hasNextPage),
        nextCursor: data.user.repositories.pageInfo.endCursor
      },
      rate: {
        limit: data.rateLimit?.limit,
        remaining: data.rateLimit?.remaining,
        reset: data.rateLimit?.resetAt
          ? Math.floor(new Date(data.rateLimit.resetAt).getTime() / 1000)
          : undefined
      }
    };
  } catch {
    // REST fallback
    try {
      const page = cursor ? Number(Buffer.from(cursor, "base64").toString("utf-8")) : 1;
      const sortParam = sort === "stars" ? "stars" : "updated";
      const { data, headers } = await rest<any[]>(
        `/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=${sortParam}&direction=desc&type=owner`
      );
      let repos = data.map(mapRestRepo);

      if (language) {
        repos = repos.filter(
          (r) =>
            r.primaryLanguage?.name.toLowerCase() === language.toLowerCase() ||
            (r.languages ?? []).some((l) => l.name.toLowerCase() === language.toLowerCase())
        );
      }
      if (q) {
        const t = q.toLowerCase();
        repos = repos.filter(
          (r) =>
            r.name.toLowerCase().includes(t) ||
            (r.description ?? "").toLowerCase().includes(t) ||
            (r.topics ?? []).some((topic) => topic.toLowerCase().includes(t))
        );
      }

      const link = headers.get("link") || "";
      const hasNextPage = link.includes('rel="next"');
      const nextPage = page + 1;
      const nextCursor = hasNextPage ? Buffer.from(String(nextPage), "utf-8").toString("base64") : null;

      return {
        ok: true,
        data: repos,
        pageInfo: { hasNextPage, nextCursor },
        rate: rateInfoFromHeaders(headers)
      };
    } catch (e: any) {
      return {
        ok: false,
        reason: e?.message || "Failed to fetch repositories",
        data: [],
        pageInfo: { hasNextPage: false, nextCursor: null }
      };
    }
  }
}
