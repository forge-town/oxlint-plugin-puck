import { describe } from "vitest";
import plugin from "./no-explicit-unknown.js";
import { runRuleTests } from "../../test-utils.js";

const rule = plugin.rules["no-explicit-unknown"];

describe("no-explicit-unknown", () => {
  runRuleTests("no-explicit-unknown", rule, {
    valid: ["let x: string;", "const y: User = getUser();", "function f(a: number): void {}"],
    invalid: [
      {
        code: "let x: unknown;",
        errors: [{ messageId: "noExplicitUnknown" }],
      },
      {
        code: "function f(a: unknown): void {}",
        errors: [{ messageId: "noExplicitUnknown" }],
      },
    ],
  });
});
