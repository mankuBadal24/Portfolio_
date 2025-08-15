export function RepoCardSkeleton() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="h-5 w-2/3 rounded bg-white/40 dark:bg-white/10 mb-3" />
      <div className="h-4 w-full rounded bg-white/40 dark:bg-white/10 mb-2" />
      <div className="h-4 w-5/6 rounded bg-white/40 dark:bg-white/10 mb-4" />
      <div className="flex gap-3">
        <div className="h-4 w-20 rounded bg-white/40 dark:bg-white/10" />
        <div className="h-4 w-16 rounded bg-white/40 dark:bg-white/10" />
      </div>
    </div>
  );
}

export function RepoGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <RepoCardSkeleton key={i} />
      ))}
    </div>
  );
}
