import Link from "next/link";
import Image from "next/image";
import { Repo } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export default function RepoCard({ repo }: { repo: Repo }) {
  const hasDemo = !!repo.homepageUrl;
  return (
    <div className="card p-5 h-full flex flex-col">
      {repo.openGraphImageUrl && (
        <div className="relative mb-4 h-36 w-full overflow-hidden rounded-xl border border-white/10">
          {/* allow remote OG images via next.config.mjs */}
          <Image
            src={repo.openGraphImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-lg">
            <Link href={`/project/${repo.owner.login}/${repo.name}`} className="hover:text-brand">
              {repo.name}
            </Link>
          </h3>
          <div className="text-xs opacity-70">{repo.visibility === "PUBLIC" ? "Public" : "Private"}</div>
        </div>

        {repo.description && <p className="mt-2 text-sm opacity-90">{repo.description}</p>}

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {repo.primaryLanguage?.name && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-2 py-1">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: repo.primaryLanguage.color ?? "currentColor" }}
              />
              {repo.primaryLanguage.name}
            </span>
          )}
          {(repo.topics ?? []).slice(0, 4).map((t) => (
            <span key={t} className="rounded-full bg-white/5 px-2 py-1 border border-white/10">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span title="Stars">⭐ {repo.stargazerCount}</span>
          <span title="Forks">🍴 {repo.forkCount}</span>
        </div>
        <span className="opacity-70">Updated {timeAgo(repo.updatedAt)}</span>
      </div>

      <div className="mt-4 flex gap-3">
        <a href={repo.htmlUrl} target="_blank" rel="noreferrer" className="rounded-xl border px-3 py-2">
          GitHub
        </a>
        {hasDemo && (
          <a
            href={repo.homepageUrl ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-brand text-white px-3 py-2"
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
