/**
 * @fileoverview Oxlint JS plugin: disallow aliases in import and export syntax.
 */

import type { OxlintRuleModule, TSESLint, TSESTree } from "../../types";

export type NoImportExportAliasOptions = readonly [{ allowNamespaceImports?: boolean }?];

const hasAsToken = (sourceCode: TSESLint.SourceCode, node: TSESTree.Node): boolean =>
  sourceCode.getTokens(node).some((token) => token.value === "as");

const noImportExportAliasRule: OxlintRuleModule<"noAlias", NoImportExportAliasOptions> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow aliases in import and export syntax",
    },
    messages: {
      noAlias: "Do not use `as` aliases in imports or exports.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowNamespaceImports: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const sourceCode = context.getSourceCode ? context.getSourceCode() : context.sourceCode;
    const allowNamespaceImports = context.options[0]?.allowNamespaceImports ?? false;

    return {
      ImportSpecifier(node) {
        if (hasAsToken(sourceCode, node)) {
          context.report({ node, messageId: "noAlias" });
        }
      },
      ImportNamespaceSpecifier(node) {
        if (!allowNamespaceImports) {
          context.report({ node, messageId: "noAlias" });
        }
      },
      ExportSpecifier(node) {
        if (hasAsToken(sourceCode, node)) {
          context.report({ node, messageId: "noAlias" });
        }
      },
      ExportAllDeclaration(node) {
        if (node.exported) {
          context.report({ node, messageId: "noAlias" });
        }
      },
    };
  },
};

const plugin = {
  meta: {
    name: "module-aliases",
  },
  rules: {
    "no-import-export-alias": noImportExportAliasRule,
  },
};

export default plugin;
