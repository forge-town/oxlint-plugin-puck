import { describe } from "vitest";
import plugin from "./strict-jsx-callback-handler";
import { runRuleTests } from "../../test-utils";

const rule = plugin.rules["strict-jsx-callback-handler"];

describe("strict-jsx-callback-handler", () => {
  runRuleTests("strict-jsx-callback-handler", rule, {
    valid: [
      {
        code: `
          function handleClick() {}
          const el = <Button onClick={handleClick} />;
        `,
        filename: "src/components/Button.tsx",
      },
      {
        code: `
          function handleSubmit() {}
          const el = <Form onSubmit={handleSubmit} />;
        `,
        filename: "src/components/Form.tsx",
      },
      {
        code: `
          function handleSave() {}
          const el = <Button onClick={handleSave.bind(null, id)} />;
        `,
        filename: "src/components/Button.tsx",
      },
      {
        code: `
          const form = useForm();
          const el = <Form onSubmit={form.handleSubmit(onSave)} />;
        `,
        filename: "src/components/Form.tsx",
      },
      {
        code: `
          const el = <Input onChange={field.onChange} onBlur={field.onBlur} />;
        `,
        filename: "src/components/Input.tsx",
      },
      {
        code: "const el = <div onClick={() => doSomething()} />;",
        filename: "src/e2e/utils.tsx",
      },
    ],
    invalid: [
      {
        code: `
          function onSave() {}
          const el = <Button onClick={onSave} />;
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "invalidCallback" }],
      },
      {
        code: `
          const el = <Button onClick={() => doSomething()} />;
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "invalidCallback" }],
      },
      {
        code: `
          function save() {}
          const el = <Button onClick={save} />;
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "invalidCallback" }],
      },
      {
        code: `
          const el = <Button onClick={notHandle} />;
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "invalidCallback" }],
      },
    ],
  });
});
