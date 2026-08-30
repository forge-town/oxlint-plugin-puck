import {
  RuleTester,
  type InvalidTestCase,
  type ValidTestCase,
} from "@typescript-eslint/rule-tester";
import tsParser from "@typescript-eslint/parser";
import { afterAll, describe, it } from "vitest";
import type { OxlintRuleModule } from "./types";

const DEFAULT_PARSER_OPTIONS = {
  ecmaVersion: 2022,
  sourceType: "module",
  ecmaFeatures: { jsx: true },
} as const;

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.itSkip = it.skip;

export type ValidRuleTestCase<Options extends readonly unknown[] = readonly unknown[]> =
  ValidTestCase<Options>;

export type InvalidRuleTestCase<
  MessageIds extends string,
  Options extends readonly unknown[] = readonly unknown[],
> = InvalidTestCase<MessageIds, Options>;

export const createRuleTester = (): RuleTester =>
  new RuleTester({
    languageOptions: {
      parser: tsParser,
      parserOptions: DEFAULT_PARSER_OPTIONS,
    },
  });

export const runRuleTests = <
  TMessageIds extends string,
  TOptions extends readonly unknown[] = readonly unknown[],
>(
  name: string,
  rule: OxlintRuleModule<TMessageIds, TOptions>,
  tests: {
    valid: Array<string | ValidTestCase<TOptions>>;
    invalid: Array<InvalidTestCase<TMessageIds, TOptions>>;
  }
): void => {
  createRuleTester().run(name, rule, tests);
};
