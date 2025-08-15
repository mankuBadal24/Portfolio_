import { Repo } from "@/lib/types";
import RepoCard from "./RepoCard";

export default function RepoGrid({ repos }: { repos: Repo[] }) {
  if (!repos.length) {
    return <p className="opacity-80">No repositories match your filters.</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((r) => (
        <RepoCard key={r.id} repo={r} />
      ))}
    </div>
  );
}
