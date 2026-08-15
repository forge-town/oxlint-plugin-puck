import { describe } from "vitest";
import plugin from "./strict-jsx-handler-verb";
import { runRuleTests } from "../../test-utils";

const rule = plugin.rules["strict-jsx-handler-verb"];

describe("strict-jsx-handler-verb", () => {
  runRuleTests("strict-jsx-handler-verb", rule, {
    valid: [
      {
        code: "const el = <Button onClick={handleClick} />;",
        filename: "src/components/Button.tsx",
      },
      {
        code: "const el = <Button onChange={handleChange} />;",
        filename: "src/components/Button.tsx",
      },
      {
        code: "const el = <Form onSubmit={handleSubmit} />;",
        filename: "src/components/Form.tsx",
      },
      {
        code: "const el = <Button onClick={handleClick.bind(null, id)} />;",
        filename: "src/components/Button.tsx",
      },
      {
        code: "const el = <Button onClick={handleSomethingElse} />;",
        filename: "src/e2e/utils.tsx",
      },
      {
        code: "const el = <Button onClick={notHandle} />;",
        filename: "src/components/Button.tsx",
      },
    ],
    invalid: [
      {
        code: "const el = <Button onClick={handleChange} />;",
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "mismatchedVerb" }],
      },
      {
        code: "const el = <Button onClick={handleSubmit} />;",
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "mismatchedVerb" }],
      },
      {
        code: "const el = <Button onChange={handleClick} />;",
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "mismatchedVerb" }],
      },
    ],
  });
});
