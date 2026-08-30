import type { TSESTree } from "@typescript-eslint/utils";

export const unwrapExpression = (
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

export const getCalleeName = (callee: TSESTree.Node): string => {
  const expression = unwrapExpression(callee);

  if (expression?.type === "Identifier") {
    return expression.name;
  }

  if (expression?.type === "MemberExpression") {
    if (expression.property.type === "Identifier") {
      return expression.property.name;
    }

    if (expression.property.type === "Literal") {
      return String(expression.property.value);
    }
  }

  return "";
};
