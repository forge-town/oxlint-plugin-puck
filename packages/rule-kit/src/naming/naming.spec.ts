import { describe, expect, it } from "vitest";
import { isHandleName, isOnName } from "./naming";

describe("callback naming helpers", () => {
  it("recognizes handle callbacks with an uppercase or numeric suffix", () => {
    // The prefix alone is insufficient: a callback name starts only when the next character
    // establishes a new PascalCase or numeric segment.
    expect(isHandleName("handleClick")).toBe(true);
    expect(isHandleName("handle2Factor")).toBe(true);
    expect(isHandleName("handler")).toBe(false);
  });

  it("recognizes on callbacks with an uppercase or numeric suffix", () => {
    // Keep prop callback detection symmetrical with handle callback detection while rejecting
    // ordinary words such as `once` that merely begin with the same letters.
    expect(isOnName("onSave")).toBe(true);
    expect(isOnName("on2Factor")).toBe(true);
    expect(isOnName("once")).toBe(false);
  });
});
