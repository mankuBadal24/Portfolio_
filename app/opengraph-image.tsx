/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const runtime = "edge";
export const alt = `${BRAND.name} — ${BRAND.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #0B0E14 0%, #111827 100%)",
          color: "white",
          padding: "56px",
          fontSize: 44
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: "100%",
            justifyContent: "center"
          }}
        >
          <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 56 }}>
            {BRAND.name}
          </div>
          <div style={{ opacity: 0.85 }}>{BRAND.role}</div>
          <div style={{ marginTop: 16, fontSize: 24, opacity: 0.75 }}>
            {BRAND.adjectives.join(" • ")}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
