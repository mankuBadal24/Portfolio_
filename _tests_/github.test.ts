import { describe, it, expect } from "vitest";
import { hexToHslTuple } from "@/lib/utils";

describe("utils", () => {
  it("converts hex to HSL tuple", () => {
    const [h, s, l] = hexToHslTuple("#2563EB"); // blue-600
    expect(typeof h).toBe("number");
    expect(typeof s).toBe("number");
    expect(typeof l).toBe("number");
  });
});
