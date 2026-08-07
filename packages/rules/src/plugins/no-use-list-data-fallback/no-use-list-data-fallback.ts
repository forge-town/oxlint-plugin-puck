/**
 * @fileoverview Oxlint JS plugin: Disallow fallback arrays for Refine useList result data.
 */

import type { OxlintRuleModule, TSESTree } from "../../types.js";

const unwrapExpression = (
  node: TSESTree.Node | null | undefined
): TSESTree.Node | null | undefined => {
  if (
    node &&
    (node.type === "ChainExpression" ||
      node.type === "TSAsExpression" ||
      node.type === "TSSatisfiesExpression" ||
      node.type === "TSNonNullExpression")
  ) {
    return unwrapExpression(node.expression);
  }

  return node;
};

const isUseListCall = (node: TSESTree.Node | null | undefined): boolean => {
  const expression = unwrapExpression(node);

  return (
    expression?.type === "CallExpression" &&
    expression.callee.type === "Identifier" &&
    expression.callee.name === "useList"
  );
};

const getPropertyName = (node: TSESTree.Node | null | undefined): string | undefined => {
  if (!node) {
    return undefined;
  }

  if (node.type === "Identifier") {
    return node.name;
  }

  if (node.type === "Literal") {
    return String(node.value);
  }

  return undefined;
};

const getBoundIdentifierName = (node: TSESTree.Node | null | undefined): string | undefined => {
  const expression = unwrapExpression(node);

  if (expression?.type === "Identifier") {
    return expression.name;
  }

  if (expression?.type === "AssignmentPattern" && expression.left.type === "Identifier") {
    return expression.left.name;
  }

  return undefined;
};

const isEmptyArrayExpression = (node: TSESTree.Node | null | undefined): boolean => {
  const expression = unwrapExpression(node);

  return expression?.type === "ArrayExpression" && expression.elements.length === 0;
};

const getUseListResultDataReplacement = (
  node: TSESTree.Node | null | undefined,
  resultIdentifiers: Set<string>,
  returnIdentifiers: Set<string>
): string | undefined => {
  const expression = unwrapExpression(node);

  if (expression?.type !== "MemberExpression") {
    return undefined;
  }

  if (getPropertyName(expression.property) !== "data") {
    return undefined;
  }

  const object = unwrapExpression(expression.object);

  if (object?.type === "Identifier" && resultIdentifiers.has(object.name)) {
    return `${object.name}.data`;
  }

  if (object?.type === "MemberExpression" && getPropertyName(object.property) === "result") {
    const resultObject = unwrapExpression(object.object);

    if (resultObject?.type === "Identifier" && returnIdentifiers.has(resultObject.name)) {
      return `${resultObject.name}.result.data`;
    }
  }

  return undefined;
};

const noUseListDataFallbackRule: OxlintRuleModule<"noFallback"> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow `?? []` fallbacks for Refine useList result.data because it is always an array",
    },
    messages: {
      noFallback:
        "useList result.data is always an array. Use result.data directly instead of optional chaining or `?? []`.",
    },
    schema: [],
    fixable: "code",
  },
  create(context) {
    const resultIdentifiers = new Set<string>();
    const returnIdentifiers = new Set<string>();

    return {
      VariableDeclarator(node) {
        if (!isUseListCall(node.init)) {
          return;
        }

        if (node.id.type === "Identifier") {
          returnIdentifiers.add(node.id.name);

          return;
        }

        if (node.id.type !== "ObjectPattern") {
          return;
        }

        for (const property of node.id.properties) {
          if (property.type !== "Property") {
            continue;
          }

          if (getPropertyName(property.key) !== "result") {
            continue;
          }

          const identifierName = getBoundIdentifierName(property.value);

          if (identifierName) {
            resultIdentifiers.add(identifierName);
          }
        }
      },

      LogicalExpression(node) {
        if (node.operator !== "??" || !isEmptyArrayExpression(node.right)) {
          return;
        }

        const replacement = getUseListResultDataReplacement(
          node.left,
          resultIdentifiers,
          returnIdentifiers
        );

        if (!replacement) {
          return;
        }

        context.report({
          node,
          messageId: "noFallback",
          fix(fixer) {
            return fixer.replaceText(node, replacement);
          },
        });
      },
    };
  },
};

const plugin = {
  meta: {
    name: "template-refine",
  },
  rules: {
    "no-use-list-data-fallback": noUseListDataFallbackRule,
  },
};

export default plugin;
