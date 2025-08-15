import Hero from "@/components/Hero";
import Section from "@/components/Section";
import Container from "@/components/Container";
import RepoGrid from "@/components/RepoGrid";
import { RepoGridSkeleton } from "@/components/Skeletons";
import ErrorState from "@/components/ErrorState";

/** Server components fetch initial data; routes have revalidate=60 */
async function getJSON<T>(path: string): Promise<T> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${base}${path}`, { next: { revalidate: 60 } });
    
    // Check if response is ok
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText} for ${path}`);
      return { ok: false, data: [], reason: `API returned ${res.status}` } as T;
    }
    
    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.error(`Non-JSON response from ${path}:`, contentType);
      return { ok: false, data: [], reason: 'Invalid response format' } as T;
    }
    
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error);
    return { ok: false, data: [], reason: 'Network error' } as T;
  }
}

/**
 * Phase 1: Static Hero + placeholder sections.
 * Phase 2: Stream Featured + Recent Repos using server components + SWR.
 */
export default async function HomePage() {
  // Safely fetch GitHub data with fallbacks
  const [pinned, recent] = await Promise.all([
    getJSON<{ ok: boolean; data: any[]; reason?: string }>("/api/github/pinned").catch(() => ({ 
      ok: false, 
      data: [], 
      reason: "GitHub API route not found" 
    })),
    getJSON<{ ok: boolean; data: any[] }>("/api/github/repos?perPage=6").catch(() => ({ 
      ok: false, 
      data: [] 
    }))
  ]);

  return (
    <>
      <Hero />
      
      <Section id="about" title="About">
        <Container className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <p>
              I'm <strong>Mayank Badal</strong>, a{" "}
              <strong>Full stack Developer</strong> who enjoys building end-to-end products —
              from clean UI to robust backends. I've worked with Java/Spring Boot, Flutter,
              React, and MySQL, and I care about performance, a11y, and maintainable code.
            </p>
            <p>
              This site is built with <em>Next.js 14 App Router</em>, TypeScript, Tailwind, and
              Framer Motion. In the next phase, it will fetch my live GitHub data (pinned & recent
              repos) with SWR and a server-only GitHub client.
            </p>
          </div>
          <div className="p-5 card">
            <h3 className="font-heading text-lg mb-2">Quick facts</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Based in India</li>
              <li>Java • Spring Boot • React • Flutter</li>
              <li>Open-source & hackathons enthusiast</li>
            </ul>
          </div>
        </Container>
      </Section>

      <Section id="skills" title="Skills">
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              "Java",
              "Spring Boot",
              "React",
              "Next.js",
              "TypeScript",
              "Flutter",
              "MySQL",
              "GitHub",
              "Tailwind",
              "Framer Motion"
            ].map((s) => (
              <span key={s} className="card px-4 py-2 text-center text-sm">{s}</span>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="featured" title="Featured Projects (Pinned)">
        <Container>
          {!pinned.ok ? (
            <ErrorState
              title="Pinned repositories unavailable"
              message={
                pinned.reason ??
                "GraphQL is required to fetch pinned items. View my GitHub profile instead."
              }
              cta={
                <a
                  href="https://github.com/mankuBadal24"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-brand text-white px-4 py-2"
                >
                  View on GitHub
                </a>
              }
            />
          ) : pinned.data.length ? (
            <RepoGrid repos={pinned.data as any} />
          ) : (
            <RepoGridSkeleton count={6} />
          )}
        </Container>
      </Section>

      <Section id="recent" title="Recent Repositories">
        <Container>
          {recent.ok ? <RepoGrid repos={recent.data as any} /> : <RepoGridSkeleton count={6} />}
          <div className="mt-6">
            <a href="/projects" className="rounded-xl border px-4 py-2">
              Browse all projects →
            </a>
          </div>
        </Container>
      </Section>

      <Section id="contact" title="Contact">
        <Container className="max-w-2xl">
          <p className="mb-4">
            Want to collaborate or hire me? Reach me at{" "}
            <a href="mailto:badalmayank23@gmail.com" className="font-medium">
              badalmayank23@gmail.com
            </a>
            .
          </p>
          <p className="text-sm opacity-80">
            In Phase 3, this will use a secure server route to send emails via Resend/SendGrid
            (no client-side secrets).
          </p>
        </Container>
      </Section>
    </>
  );
}