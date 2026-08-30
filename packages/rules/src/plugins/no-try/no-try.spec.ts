import { describe } from "vitest";
import plugin from "./no-try";
import { runRuleTests } from "../../test-utils";

const rule = plugin.rules["no-try"];

describe("no-try", () => {
  runRuleTests("no-try", rule, {
    valid: [
      "const result = ok(value);",
      "function load() { return err(new Error('x')); }",
      "Promise.resolve().catch(() => {});",
    ],
    invalid: [
      {
        code: "try { foo(); } catch (e) { handle(e); }",
        errors: [{ messageId: "noTry" }],
      },
      {
        code: "try { foo(); } finally { cleanup(); }",
        errors: [{ messageId: "noTry" }],
      },
    ],
  });
});
