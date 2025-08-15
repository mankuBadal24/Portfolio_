import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.25rem",
        lg: "2rem",
        xl: "2.5rem"
      }
    },
    extend: {
      colors: {
        brand: {
          // tweak these tokens freely; they map to your brand in lib/brand.ts
          DEFAULT: "hsl(var(--brand-500))",
          50: "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          300: "hsl(var(--brand-300))",
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
          800: "hsl(var(--brand-800))",
          900: "hsl(var(--brand-900))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent-500))",
          400: "hsl(var(--accent-400))",
          500: "hsl(var(--accent-500))",
          600: "hsl(var(--accent-600))"
        }
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      boxShadow: {
        soft: "0 6px 24px -6px rgba(0,0,0,0.12)"
      }
    }
  },
  plugins: []
} satisfies Config;
