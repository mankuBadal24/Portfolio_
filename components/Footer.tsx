import { BRAND } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10">
      <div className="container py-8 text-sm flex flex-col sm:flex-row gap-2 items-center justify-between">
        <p className="opacity-80">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
        <div className="flex gap-4">
          {BRAND.social.github && (
            <a href={BRAND.social.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {BRAND.social.linkedin && (
            <a href={BRAND.social.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {BRAND.social.twitter && (
            <a href={BRAND.social.twitter} target="_blank" rel="noreferrer">
              Twitter
            </a>
          )}
          {BRAND.social.other && (
            <a href={BRAND.social.other} target="_blank" rel="noreferrer">
              Other
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
