import { describe } from "vitest";
import plugin from "./no-let.js";
import { runRuleTests } from "../../test-utils.js";

const rule = plugin.rules["no-let"];

describe("no-let", () => {
  runRuleTests("no-let", rule, {
    valid: ["const x = 1;", "const [a, b] = arr;", "for (const item of items) {}"],
    invalid: [
      {
        code: "let x = 1;",
        errors: [{ messageId: "noLet" }],
      },
      {
        code: "let x;",
        errors: [{ messageId: "noLet" }],
      },
    ],
  });
});
