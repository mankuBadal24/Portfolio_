import "./globals.css";
import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { hexToHslTuple } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Inter, Sora } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fontHeading = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap"
});
const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: `${BRAND.name} — ${BRAND.role}`,
  description:
    "Portfolio of Mayank Badal, Full stack Developer. Projects, skills, experience, and contact.",
  authors: [{ name: BRAND.name }],
  applicationName: "Mayank Badal — Portfolio",
  openGraph: {
    type: "website",
    title: `${BRAND.name} — ${BRAND.role}`,
    siteName: BRAND.name,
    url: "/",
    images: ["/api/og"] // resolved to app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    creator: "@",
    title: `${BRAND.name} — ${BRAND.role}`,
    description:
      "Portfolio of Mayank Badal, Full stack Developer. Projects, skills, experience, and contact."
  },
  keywords: ["Mayank Badal", "Full stack Developer", "Java", "Spring Boot", "Flutter", "React"]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [h, s, l] = hexToHslTuple(BRAND.colors.primaryHex);
  const [ah, as, al] = hexToHslTuple(BRAND.colors.secondaryHex);

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${fontHeading.variable} ${fontBody.variable} font-body antialiased`}
        style={
          {
            // brand tokens -> Tailwind via HSL vars
            ["--brand-500" as any]: `${h} ${s}% ${l}%`,
            ["--accent-500" as any]: `${ah} ${as}% ${al}%`
          } as React.CSSProperties
        }
      >
        <a href="#content" className="skip-link">Skip to content</a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main id="content" className="min-h-[calc(100dvh-64px)]">{children}</main>
          <Footer />
        </ThemeProvider>

        {/* Structured Data: Person & Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: BRAND.name,
              jobTitle: BRAND.role,
              url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              sameAs: Object.values(BRAND.social).filter(Boolean)
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: `${BRAND.name} — ${BRAND.role}`,
              url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
            })
          }}
        />
      </body>
    </html>
  );
}
