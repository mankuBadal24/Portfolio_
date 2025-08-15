import Container from "@/components/Container";
import Section from "@/components/Section";
import RepoCard from "@/components/RepoCard";
import { Repo } from "@/lib/types";

/** Minimal detail page using REST (works without GraphQL) */
async function getRepo(owner: string, name: string): Promise<Repo | null> {
  const base = "https://api.github.com";
  const res = await fetch(`${base}/repos/${owner}/${name}`, {
    headers: {
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      "User-Agent": "mayank-portfolio"
    },
    next: { revalidate: 60 }
  });
  if (!res.ok) return null;
  const r = await res.json();
  return {
    id: String(r.id),
    name: r.name,
    description: r.description,
    stargazerCount: r.stargazers_count,
    forkCount: r.forks_count,
    primaryLanguage: r.language ? { name: r.language, color: null } : null,
    languages: [],
    topics: r.topics ?? [],
    updatedAt: r.updated_at,
    homepageUrl: r.homepage ?? null,
    htmlUrl: r.html_url,
    openGraphImageUrl: r.owner?.avatar_url ?? null,
    owner: { login: r.owner?.login ?? "" },
    visibility: r.private ? "PRIVATE" : "PUBLIC"
  };
}

export default async function RepoPage({
  params
}: {
  params: { owner: string; name: string };
}) {
  const repo = await getRepo(params.owner, params.name);
  return (
    <Section title={`${params.owner}/${params.name}`}>
      <Container>
        {!repo ? (
          <p className="opacity-80">Repository not found.</p>
        ) : (
          <div className="max-w-3xl">
            {/* Reuse card UI */}
            <RepoCard repo={repo} />
            <div className="mt-6">
              <a href={repo.htmlUrl} target="_blank" rel="noreferrer" className="underline">
                View on GitHub
              </a>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
