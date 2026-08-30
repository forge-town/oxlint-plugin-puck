import { describe } from "vitest";
import plugin from "./no-handle-calls-on";
import { runRuleTests } from "../../test-utils";

const rule = plugin.rules["no-handle-calls-on"];

describe("no-handle-calls-on", () => {
  runRuleTests("no-handle-calls-on", rule, {
    valid: [
      {
        code: `
          function handleClick() {
            doSomething();
          }
        `,
        filename: "src/components/Button.tsx",
      },
      {
        code: `
          function handleSave() {
            handleSubmit();
          }
        `,
        filename: "src/components/Button.tsx",
      },
      {
        code: `
          function onClick() {
            handleClick();
          }
        `,
        filename: "src/components/Button.tsx",
      },
      {
        code: `
          function handleClick() {
            onSave();
          }
        `,
        filename: "src/e2e/utils.tsx",
      },
    ],
    invalid: [
      {
        code: `
          function handleClick() {
            onSave();
          }
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "noOnCall" }],
      },
      {
        code: `
          const handleClick = () => {
            onCancel();
          };
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "noOnCall" }],
      },
      {
        code: `
          function handleClick() {
            onSave();
            onCancel();
          }
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "noOnCall" }, { messageId: "noOnCall" }],
      },
    ],
  });
});
