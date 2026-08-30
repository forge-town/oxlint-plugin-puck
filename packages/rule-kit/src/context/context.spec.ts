import { describe, expect, it } from "vitest";
import { getFilename } from "./context";

describe("getFilename", () => {
  it("uses Oxlint filename fields before legacy fallbacks", () => {
    // Oxlint may expose every filename API at once. The direct `filename` value is the
    // authoritative path and must win so rules do not accidentally lint a stale fallback path.
    expect(
      getFilename({
        filename: "src/current.tsx",
        physicalFilename: "src/physical.tsx",
        getFilename: () => "src/legacy.tsx",
        sourceCode: { filename: "src/source.tsx" },
      })
    ).toBe("src/current.tsx");
  });

  it("falls back through physical, legacy, and source-code filenames", () => {
    // Different ESLint/Oxlint adapter versions expose the filename in different locations.
    // Verify every supported fallback independently so removing one cannot be hidden by another.
    expect(getFilename({ physicalFilename: "src/physical.tsx" })).toBe("src/physical.tsx");
    expect(getFilename({ getFilename: () => "src/legacy.tsx" })).toBe("src/legacy.tsx");
    expect(getFilename({ sourceCode: { filename: "src/source.tsx" } })).toBe("src/source.tsx");
  });

  it("returns an empty string when no filename is exposed", () => {
    // Processors and virtual sources may not have a path. Returning an empty string lets
    // file-scoped rules opt out without throwing while resolving their context.
    expect(getFilename({})).toBe("");
  });
});
