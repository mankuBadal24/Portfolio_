"use client";

type Props = {
  languages: string[];
  selectedLanguage?: string;
  onLanguageChange: (lang: string | undefined) => void;
  sort: "updated" | "stars";
  onSortChange: (s: "updated" | "stars") => void;
};

export default function Filters({
  languages,
  selectedLanguage,
  onLanguageChange,
  sort,
  onSortChange
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        aria-label="Filter by language"
        className="rounded-xl border border-white/10 bg-white/60 dark:bg-white/10 px-3 py-2"
        value={selectedLanguage || ""}
        onChange={(e) => onLanguageChange(e.target.value || undefined)}
      >
        <option value="">All languages</option>
        {languages.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort repositories"
        className="rounded-xl border border-white/10 bg-white/60 dark:bg-white/10 px-3 py-2"
        value={sort}
        onChange={(e) => onSortChange(e.target.value as "updated" | "stars")}
      >
        <option value="updated">Recently updated</option>
        <option value="stars">Most stars</option>
      </select>
    </div>
  );
}
