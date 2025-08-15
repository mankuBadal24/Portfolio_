"use client";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#featured", label: "Projects" },
  { href: "#contact", label: "Contact" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-colors",
        scrolled
          ? "backdrop-blur bg-white/70 dark:bg-[#0B0E14]/70 border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <nav className="container h-16 flex items-center justify-between">
        <Link href="/" className="font-heading text-lg">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand shadow-[0_0_0_4px_rgba(37,99,235,0.2)]"></span>
            Mayank<span className="opacity-60">/</span>Portfolio
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm hover:text-brand">
              {n.label}
            </a>
          ))}
          <ThemeToggle />
        </div>
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
