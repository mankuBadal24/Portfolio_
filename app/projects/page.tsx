"use client";

import useSWR from "swr";
import Section from "@/components/Section";
import Container from "@/components/Container";
import Search from "@/components/Search";
import Filters from "@/components/Filters";
import RepoGrid from "@/components/RepoGrid";
import { RepoGridSkeleton } from "@/components/Skeletons";
import ErrorState from "@/components/ErrorState";
import { useEffect, useMemo, useState } from "react";
import type { Repo, ReposResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProjectsPage() {
  const [q, setQ] = useState("");
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<"updated" | "stars">("updated");
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const perPage = 12;

  const params = new URLSearchParams();
  params.set("perPage", String(perPage));
  params.set("sort", sort);
  if (language) params.set("language", language);
  if (q) params.set("q", q);
  if (cursor) params.set("cursor", cursor);

  const { data, error, isLoading, mutate } = useSWR<ReposResponse>(
    `/api/github/repos?${params.toString()}`,
    fetcher,
    { refreshInterval: 30000 } // SWR keep-fresh
  );

  useEffect(() => {
    setCursor(undefined); // reset pagination on filter change
  }, [q, language, sort]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    data?.data.forEach((r) => {
      r.primaryLanguage?.name && set.add(r.primaryLanguage.name);
      r.languages?.forEach((l) => set.add(l.name));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const hasNext = data?.pageInfo.hasNextPage;

  const repos = useMemo(() => {
    // Client-side safety filter (server also filters)
    if (!data?.data) return [];
    return data.data as Repo[];
  }, [data]);

  return (
    <Section title="Projects">
      <Container className="space-y-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <Search defaultValue="" onChange={setQ} />
          <Filters
            languages={languages}
            selectedLanguage={language}
            onLanguageChange={setLanguage}
            sort={sort}
            onSortChange={setSort}
          />
        </div>

        {error && (
          <ErrorState
            title="Failed to load repositories"
            message={String(error)}
            cta={
              <a
                href="https://github.com/mankuBadal24?tab=repositories"
                className="rounded-xl bg-brand text-white px-4 py-2"
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
            }
          />
        )}

        {isLoading ? <RepoGridSkeleton count={9} /> : <RepoGrid repos={repos} />}

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            disabled={!hasNext}
            onClick={() => setCursor(data?.pageInfo.nextCursor ?? undefined)}
            className="rounded-xl border px-4 py-2 disabled:opacity-50"
          >
            {hasNext ? "Load more" : "No more results"}
          </button>
          <button onClick={() => mutate()} className="rounded-xl border px-4 py-2">
            Refresh
          </button>
        </div>

        {data?.rate && data.rate.remaining !== undefined && data.rate.remaining <= 10 && (
          <p className="text-xs opacity-80 text-center">
            Near GitHub rate limit. Some data may update slower. You can also{" "}
            <a
              className="underline"
              target="_blank"
              rel="noreferrer"
              href="https://github.com/mankuBadal24?tab=repositories"
            >
              view on GitHub
            </a>
            .
          </p>
        )}
      </Container>
    </Section>
  );
}
