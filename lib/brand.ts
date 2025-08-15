/**
 * Brand configuration.
 * You can override via .env or update defaults here.
 */
export const BRAND = {
  name: "Mayank Badal",
  role: "Full stack Developer",
  adjectives:
    process.env.BRAND_ADJECTIVES?.split(",").map((s) => s.trim()) ?? ["Clean", "Bold", "Playful"],
  colors: {
    // Defaults map to Tailwind brand/accent via CSS vars in globals.css
    primaryHex: process.env.PRIMARY_COLOR_HEX || "#2563EB", // Tailwind blue-600
    secondaryHex: process.env.SECONDARY_COLOR_HEX || "#F59E0B" // amber-500
  },
  fonts: {
    heading: process.env.FONT_HEADING || "Sora",
    body: process.env.FONT_BODY || "Inter"
  },
  social: {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "",
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/mankuBadal24",
    other: process.env.NEXT_PUBLIC_OTHER_URL || ""
  },
  contactEmail: "badalmayank23@gmail.com",
  githubUsername: "mankuBadal24"
} as const;
