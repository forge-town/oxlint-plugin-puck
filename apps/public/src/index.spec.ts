import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import plugin from "./index";

const publicRuleNames = [
  "jsx-sort-props",
  "newline-before-return",
  "no-let",
  "no-try-catch",
  "no-use-effect",
];
const internalRuleMarkers = [
  "atomic-component",
  "no-import-export-alias",
  "strict-method-module",
];

describe("Puck public distribution", () => {
  it("exposes only the public rules", () => {
    expect(plugin.meta.name).toBe("puck");
    expect(Object.keys(plugin.rules).sort()).toEqual(publicRuleNames);
  });

  it("bundles without workspace imports or internal rule implementations", async () => {
    const bundlePath = new URL("../dist/index.js", import.meta.url);
    const bundle = await readFile(bundlePath, "utf8");

    expect(bundle).not.toContain("@repo/");

    for (const marker of internalRuleMarkers) {
      expect(bundle).not.toContain(marker);
    }
  });
});
