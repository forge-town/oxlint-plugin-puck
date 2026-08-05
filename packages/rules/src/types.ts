import type { TSESLint } from "@typescript-eslint/utils";

export type { TSESLint, TSESTree } from "@typescript-eslint/utils";

export type OxlintRuleContext<
  MessageIds extends string = string,
  Options extends readonly unknown[] = readonly unknown[],
> = TSESLint.RuleContext<MessageIds, Options> & {
  filename?: string;
  physicalFilename?: string;
};

export type OxlintRuleModule<
  MessageIds extends string = string,
  Options extends readonly unknown[] = readonly unknown[],
> = TSESLint.RuleModule<MessageIds, Options>;
