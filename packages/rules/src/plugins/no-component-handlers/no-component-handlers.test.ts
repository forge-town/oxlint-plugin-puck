import { describe } from "vitest";
import plugin from "./no-component-handlers";
import { runRuleTests } from "../../test-utils";

const componentHandlerRule = plugin.rules["no-component-handlers"];
const handleReturnFunctionRule = plugin.rules["no-handle-return-function"];

describe("no-component-handlers", () => {
  runRuleTests("no-component-handlers", componentHandlerRule, {
    valid: [
      {
        code: `
          function Button() {
            const { handleClick } = useButtonStore();
            return <button onClick={handleClick} />;
          }
        `,
        filename: "src/components/Button.tsx",
      },
      {
        code: `
          const { handleSave } = useStore(buttonStore, (s) => s.handleSave);
          export const Button = () => <button onClick={handleSave} />;
        `,
        filename: "src/components/Button.tsx",
      },
      {
        code: `
          const handleClick = () => {};
          export const Button = () => <button onClick={handleClick} />;
        `,
        filename: "src/stores/useButtonStore.tsx",
      },
      {
        code: "export const Button = () => <button onClick={() => {}} />;",
        filename: "src/components/Button.test.tsx",
      },
    ],
    invalid: [
      {
        code: `
          function handleClick() {}
          export const Button = () => <button onClick={handleClick} />;
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "componentHandler" }],
      },
      {
        code: `
          const handleSave = () => {};
          export const Button = () => <button onClick={handleSave} />;
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "componentHandler" }],
      },
      {
        code: `
          export const Button = () => {
            const { handleSubmit } = { handleSubmit: () => {} };
            return <form onSubmit={handleSubmit} />;
          };
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "componentHandler" }],
      },
    ],
  });
});

describe("no-handle-return-function", () => {
  runRuleTests("no-handle-return-function", handleReturnFunctionRule, {
    valid: [
      {
        code: `
          function handleClick() { doSomething(); }
        `,
        filename: "src/utils.ts",
      },
      {
        code: `
          const handleChange = () => setValue();
        `,
        filename: "src/utils.ts",
      },
    ],
    invalid: [
      {
        code: `
          function handleClick() {
            return () => doSomething();
          }
        `,
        filename: "src/utils.ts",
        errors: [{ messageId: "handleReturnFunction" }],
      },
      {
        code: `
          const handleSave = () => () => save();
        `,
        filename: "src/utils.ts",
        errors: [{ messageId: "handleReturnFunction" }],
      },
      {
        code: `
          const actions = {
            handleSubmit: () => () => submit(),
          };
        `,
        filename: "src/utils.ts",
        errors: [{ messageId: "handleReturnFunction" }],
      },
    ],
  });
});
