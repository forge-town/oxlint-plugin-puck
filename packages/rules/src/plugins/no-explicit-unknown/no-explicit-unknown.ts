/**
 * @fileoverview Oxlint JS plugin: Warn on explicit TypeScript `unknown` usage.
 */

import type { OxlintRuleModule } from "../../types";

const noExplicitUnknownRule: OxlintRuleModule<"noExplicitUnknown"> = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow explicit TypeScript `unknown` usage",
    },
    messages: {
      noExplicitUnknown: "Unexpected `unknown` type. Use a concrete schema-derived type instead.",
    },
    schema: [],
  },
  create(context) {
    return {
      TSUnknownKeyword(node) {
        context.report({
          node,
          messageId: "noExplicitUnknown",
        });
      },
    };
  },
};

const plugin = {
  meta: {
    name: "template-types",
  },
  rules: {
    "no-explicit-unknown": noExplicitUnknownRule,
  },
};

export default plugin;
