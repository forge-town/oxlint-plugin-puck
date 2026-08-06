import { describe } from "vitest";
import plugin from "./no-handle-calls-handle.js";
import { runRuleTests } from "../../test-utils.js";

const rule = plugin.rules["no-handle-calls-handle"];

describe("no-handle-calls-handle", () => {
  runRuleTests("no-handle-calls-handle", rule, {
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
            otherHelper();
          }
        `,
        filename: "src/components/Button.tsx",
      },
      {
        code: `
          function doSomething() {
            handleClick();
          }
        `,
        filename: "src/components/Button.tsx",
      },
      {
        code: `
          function handleClick() {
            handleClick();
          }
        `,
        filename: "src/e2e/utils.tsx",
      },
    ],
    invalid: [
      {
        code: `
          function handleClick() {
            handleSave();
          }
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "noHandleCall" }],
      },
      {
        code: `
          const handleClick = () => {
            handleSubmit();
          };
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "noHandleCall" }],
      },
      {
        code: `
          function handleClick() {
            handleSave();
            handleSubmit();
          }
        `,
        filename: "src/components/Button.tsx",
        errors: [
          { messageId: "noHandleCall" },
          { messageId: "noHandleCall" },
        ],
      },
    ],
  });
});
