import { type ClassValue, clsx } from "clsx";

/** Tailwind class merge helper */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Hex -> h s l string for CSS vars (no % signs here) */
export function hexToHslTuple(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const rP = r / 255;
  const gP = g / 255;
  const bP = b / 255;

  const max = Math.max(rP, gP, bP);
  const min = Math.min(rP, gP, bP);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rP:
        h = (gP - bP) / d + (gP < bP ? 6 : 0);
        break;
      case gP:
        h = (bP - rP) / d + 2;
        break;
      case bP:
        h = (rP - gP) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
