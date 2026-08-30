import { describe, expect, it } from "vitest";
import { isTsxFile, normalizePath } from "./path";

describe("path helpers", () => {
  it("normalizes Windows separators", () => {
    // Rule scopes are expressed with forward-slash fragments, so Windows paths must be
    // normalized before any directory or extension check runs.
    expect(normalizePath("src\\components\\Button.tsx")).toBe("src/components/Button.tsx");
  });

  it("detects TSX files after normalization", () => {
    // File-type checks must behave identically on Windows and POSIX paths while keeping plain
    // TypeScript files outside TSX-only rules.
    expect(isTsxFile("src\\components\\Button.tsx")).toBe(true);
    expect(isTsxFile("src/components/Button.ts")).toBe(false);
  });
});
