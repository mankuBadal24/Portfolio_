/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // will be used in Phase 2 for GitHub OG images & avatars
      { protocol: "https", hostname: "opengraph.githubassets.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" }
    ]
  }
};

export default nextConfig;
