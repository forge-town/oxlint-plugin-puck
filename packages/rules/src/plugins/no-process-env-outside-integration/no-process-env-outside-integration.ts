/**
 * @fileoverview Oxlint JS plugin: Disallow direct process.env usage outside env integrations.
 */

import type { OxlintRuleContext, OxlintRuleModule } from "../../types";

type SourceCodeWithFilename = { filename?: string };

const getFilename = (context: OxlintRuleContext): string => {
  return (
    context.filename ??
    context.physicalFilename ??
    context.getFilename?.() ??
    (context.sourceCode as SourceCodeWithFilename | undefined)?.filename ??
    ""
  );
};

const isProcessEnvMember = (node: {
  object?: { type?: string; name?: string };
  property?: { type?: string; name?: string };
}): boolean => {
  return (
    node.object?.type === "Identifier" &&
    node.object.name === "process" &&
    node.property?.type === "Identifier" &&
    node.property.name === "env"
  );
};

const isAllowedIntegrationFile = (filename: string): boolean => {
  const normalized = filename.replaceAll("\\", "/");

  return (
    normalized.includes("/src/integrations/env/") ||
    normalized.includes("/src/integrations/server-env/")
  );
};

const noProcessEnvOutsideIntegrationRule: OxlintRuleModule<"noProcessEnv"> = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow direct process.env usage outside env integration modules",
    },
    messages: {
      noProcessEnv:
        "process.env must go through src/integrations/env or src/integrations/server-env instead of being read directly.",
    },
    schema: [],
  },
  create(context: OxlintRuleContext<"noProcessEnv">) {
    const filename = getFilename(context);

    if (isAllowedIntegrationFile(filename)) {
      return {};
    }

    return {
      MemberExpression(node) {
        if (!isProcessEnvMember(node)) {
          return;
        }

        context.report({
          node,
          messageId: "noProcessEnv",
        });
      },
    };
  },
};

const plugin = {
  meta: {
    name: "template-env",
  },
  rules: {
    "no-process-env-outside-integration": noProcessEnvOutsideIntegrationRule,
  },
};

export default plugin;
