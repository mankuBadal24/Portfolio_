"use client";
import { useState, useEffect } from "react";

export default function Search({
  defaultValue,
  onChange,
  placeholder = "Search repositories..."
}: {
  defaultValue?: string;
  onChange: (q: string) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState(defaultValue ?? "");

  useEffect(() => {
    const t = setTimeout(() => onChange(q), 300);
    return () => clearTimeout(t);
  }, [q, onChange]);

  return (
    <input
      aria-label="Search repositories"
      className="w-full rounded-xl border border-white/10 bg-white/60 dark:bg-white/10 px-3 py-2"
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder={placeholder}
    />
  );
}
