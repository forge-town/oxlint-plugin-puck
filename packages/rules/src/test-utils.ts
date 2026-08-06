import { createRequire } from "node:module";
import tsParser from "@typescript-eslint/parser";
import type { RuleTester as RuleTesterNamespace } from "eslint";
import type { OxlintRuleModule } from "./types.js";

const require = createRequire(import.meta.url);

const RuleTester: typeof RuleTesterNamespace = require("eslint").RuleTester;

const DEFAULT_PARSER_OPTIONS = {
  ecmaVersion: 2022,
  sourceType: "module",
  ecmaFeatures: { jsx: true },
};

type ValidTestCase = RuleTesterNamespace.ValidTestCase;
type InvalidTestCase = RuleTesterNamespace.InvalidTestCase;

export function runRuleTests<
  TMessageIds extends string,
  TOptions extends readonly unknown[] = readonly unknown[],
>(
  name: string,
  rule: OxlintRuleModule<TMessageIds, TOptions>,
  tests: {
    valid: Array<string | ValidTestCase>;
    invalid: Array<InvalidTestCase>;
  },
): void {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser: tsParser,
      parserOptions: DEFAULT_PARSER_OPTIONS,
    },
  });

  ruleTester.run(
    name,
    rule as never,
    {
      valid: tests.valid as never,
      invalid: tests.invalid as never,
    },
  );
}
