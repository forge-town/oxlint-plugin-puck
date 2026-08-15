import { describe } from "vitest";
import plugin from "./newline-before-return";
import { runRuleTests } from "../../test-utils";

const rule = plugin.rules["newline-before-return"];

describe("newline-before-return", () => {
  runRuleTests("newline-before-return", rule, {
    valid: [
      {
        code: "function f() {\n  const x = 1;\n\n  return x;\n}",
      },
      {
        code: "function f() {\n  return 1;\n}",
      },
      {
        code: "if (x)\n  return;",
      },
      {
        code: "for (;;) {\n  return;\n}",
      },
    ],
    invalid: [
      {
        code: "function f() {\n  const x = 1;\n  return x;\n}",
        errors: [{ messageId: "expected" }],
        output: "function f() {\n  const x = 1;\n\n  return x;\n}",
      },
      {
        code: "function f() {\n  const x = 1;\n\n\n  return x;\n}",
        errors: [{ messageId: "unexpected" }],
        output: "function f() {\n  const x = 1;\n\n  return x;\n}",
      },
    ],
  });
});
