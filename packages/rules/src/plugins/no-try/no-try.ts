/**
 * @fileoverview Oxlint JS plugin: Disallow try-catch / try-finally statements.
 * Use neverthrow for functional error handling instead.
 */

import type { OxlintRuleModule } from "../../types";

const noTryRule: OxlintRuleModule<"noTry"> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow `try` statements. Use neverthrow for functional error handling instead.",
    },
    messages: {
      noTry:
        "Unexpected `try` statement. Use neverthrow (Result, ok, err) for functional error handling instead of try-catch.",
    },
    schema: [],
  },
  create(context) {
    return {
      TryStatement(node) {
        context.report({
          node,
          messageId: "noTry",
        });
      },
    };
  },
};

const plugin = {
  meta: {
    name: "template-error",
  },
  rules: {
    "no-try": noTryRule,
  },
};

export default plugin;
