import { describe, expect, it } from "vitest";
import { percentage, safeReturn, validateProgress } from "../src/lib/progress";
describe("edition-aware progress", () => {
  it("rejects page progress for an unknown edition and values outside the selected edition", () => {
    expect(() => validateProgress("pages", 5, null)).toThrow("no verified page count");
    expect(() => validateProgress("pages", 449, 448)).toThrow("448 pages");
    expect(validateProgress("pages", 448, 448)).toBe(448);
  });
  it("rejects fractions, negative progress and percentages above 100", () => {
    for (const value of [-1, 100.5, NaN, Infinity]) expect(() => validateProgress("percentage", value, null)).toThrow();
    expect(() => validateProgress("percentage", 101, null)).toThrow();
    expect(validateProgress("percentage", 0, null)).toBe(0);
    expect(validateProgress("percentage", 100, null)).toBe(100);
  });
  it("derives a percentage from the selected edition, never an inferred total", () => {
    expect(percentage({ progress: 224, progressMode: "pages" }, 448)).toBe(50);
    expect(percentage({ progress: 50, progressMode: "pages" }, null)).toBe(0);
    expect(percentage({ progress: 37, progressMode: "percentage" })).toBe(37);
  });
});
describe("return destinations", () => {
  it("keeps an internal intended destination and refuses external redirects", () => {
    expect(safeReturn("/journal/new?book=walden")).toBe("/journal/new?book=walden");
    for (const value of ["https://example.com", "//example.com", "/\\example.com", null]) expect(safeReturn(value)).toBe("/my-shelves");
  });
});
