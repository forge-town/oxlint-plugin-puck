import { describe, expect, it } from "vitest";
import plugin from "./index";

describe("Puck distribution entry", () => {
  it("exposes the internal rule registry as one named plugin", () => {
    expect(plugin.meta.name).toBe("puck");
    expect(Object.keys(plugin.rules)).toHaveLength(18);
  });
});
