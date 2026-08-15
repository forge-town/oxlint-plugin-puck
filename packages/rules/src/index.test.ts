import { describe, expect, it } from "vitest";
import { rules } from "./index";

const expectedRuleNames = [
  "atomic-component",
  "atomic-schema",
  "jsx-sort-props",
  "newline-before-return",
  "no-component-handlers",
  "no-explicit-unknown",
  "no-handle-calls-handle",
  "no-handle-calls-on",
  "no-handle-return-function",
  "no-let",
  "no-process-env-outside-integration",
  "no-try",
  "no-use-effect",
  "no-use-list-data-fallback",
  "strict-jsx-callback-handler",
  "strict-jsx-handler-verb",
  "strict-method-module",
];

describe("rule registry", () => {
  it("exports every maintained rule from one internal registry", () => {
    expect(Object.keys(rules).sort()).toEqual(expectedRuleNames);
  });
});
