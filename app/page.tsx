import Hero from "@/components/Hero";
import Section from "@/components/Section";
import Container from "@/components/Container";

/** Phase 1: Static Hero + placeholder sections.
 * Phase 2 will stream Featured + Recent Repos using server components + SWR.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Section id="about" title="About">
        <Container className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <p>
              I’m <strong>Mayank Badal</strong>, a{" "}
              <strong>Full stack Developer</strong> who enjoys building end-to-end products —
              from clean UI to robust backends. I’ve worked with Java/Spring Boot, Flutter,
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
          <div className="card p-6">
            <p className="opacity-80">
              Coming next: live pinned repositories fetched from GitHub GraphQL (Phase 2).
            </p>
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
