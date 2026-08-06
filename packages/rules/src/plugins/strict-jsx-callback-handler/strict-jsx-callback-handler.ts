/**
 * @fileoverview Oxlint JS plugin: require JSX on* callbacks to use handle* identifiers.
 */

import type { OxlintRuleContext, OxlintRuleModule, TSESTree } from "../../types.js";

type SourceCodeWithFilename = { filename?: string };

function getFilename(context: OxlintRuleContext): string {
  return context.filename ?? context.physicalFilename ?? context.getFilename?.() ?? (context.sourceCode as SourceCodeWithFilename | undefined)?.filename ?? "";
}

function normalizePath(filename: string): string {
  return filename.replaceAll("\\", "/");
}

function isTsxFile(filename: string): boolean {
  return normalizePath(filename).endsWith(".tsx");
}

function isIgnoredFile(filename: string): boolean {
  const normalized = normalizePath(filename);

  return (
    normalized.includes("/__spec__/") ||
    normalized.includes("/__tests__/") ||
    normalized.includes("/e2e/") ||
    normalized.includes("/routes/api/")
  );
}

function unwrapExpression(node: TSESTree.Node | null | undefined): TSESTree.Node | null | undefined {
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
}

function getPropertyName(node: TSESTree.Node | null | undefined): string {
  if (!node) {
    return "";
  }

  if (node.type === "Identifier" || node.type === "JSXIdentifier") {
    return node.name;
  }

  if (node.type === "Literal") {
    return String(node.value);
  }

  return "";
}

function getJsxAttributeName(node: TSESTree.JSXAttribute): string {
  return node?.name?.type === "JSXIdentifier" ? node.name.name : "";
}

function isJsxEventPropName(name: string): boolean {
  return /^on[A-Z0-9]/.test(name);
}

function isHandleName(name: string): boolean {
  return /^handle[A-Z0-9]/.test(name);
}

function isHandleIdentifier(node: TSESTree.Node): boolean {
  const expression = unwrapExpression(node);

  return expression?.type === "Identifier" && isHandleName(expression.name);
}

function getMemberObjectName(node: TSESTree.Node): string {
  const expression = unwrapExpression(node);

  if (expression?.type !== "MemberExpression") {
    return "";
  }

  const object = unwrapExpression(expression.object);

  return object?.type === "Identifier" ? object.name : "";
}

function isHandleMember(node: TSESTree.Node, localObjectNames: Set<string>): boolean {
  const expression = unwrapExpression(node);

  if (expression?.type !== "MemberExpression") {
    return false;
  }

  return (
    isHandleName(getPropertyName(expression.property)) &&
    !localObjectNames.has(getMemberObjectName(expression))
  );
}

function isHandleBindCall(node: TSESTree.Node): boolean {
  const expression = unwrapExpression(node);

  if (expression?.type !== "CallExpression") {
    return false;
  }

  const callee = unwrapExpression(expression.callee);

  if (callee?.type !== "MemberExpression" || getPropertyName(callee.property) !== "bind") {
    return false;
  }

  return isHandleIdentifier(callee.object) || isHandleMember(callee.object, new Set<string>());
}

function isFormHandleSubmitCall(node: TSESTree.Node): boolean {
  const expression = unwrapExpression(node);

  if (expression?.type !== "CallExpression") {
    return false;
  }

  const callee = unwrapExpression(expression.callee);

  return callee?.type === "MemberExpression" && getPropertyName(callee.property) === "handleSubmit";
}

function isReactHookFormFieldCallback(node: TSESTree.Node): boolean {
  const expression = unwrapExpression(node);

  if (expression?.type !== "MemberExpression") {
    return false;
  }

  const object = unwrapExpression(expression.object);
  const propertyName = getPropertyName(expression.property);

  return (
    object?.type === "Identifier" &&
    object.name === "field" &&
    (propertyName === "onChange" || propertyName === "onBlur")
  );
}

function isHandleBindCallWithLocalObjects(node: TSESTree.Node, localObjectNames: Set<string>): boolean {
  const expression = unwrapExpression(node);

  if (expression?.type !== "CallExpression") {
    return false;
  }

  const callee = unwrapExpression(expression.callee);

  if (callee?.type !== "MemberExpression" || getPropertyName(callee.property) !== "bind") {
    return false;
  }

  return isHandleIdentifier(callee.object) || isHandleMember(callee.object, localObjectNames);
}

function isAllowedCallbackExpression(node: TSESTree.Node, localObjectNames: Set<string>): boolean {
  return (
    isHandleIdentifier(node) ||
    isHandleMember(node, localObjectNames) ||
    isHandleBindCallWithLocalObjects(node, localObjectNames) ||
    isFormHandleSubmitCall(node) ||
    isReactHookFormFieldCallback(node)
  );
}

const strictJsxCallbackHandlerRule: OxlintRuleModule<"invalidCallback"> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require JSX on* callbacks to pass handle* directly or handle*.bind, except form helpers",
    },
    messages: {
      invalidCallback:
        "JSX '{{propName}}' callbacks must use handle* or handle*.bind(...). Form handleSubmit and field callbacks are the only exceptions.",
    },
    schema: [],
  },
  create(context: OxlintRuleContext<"invalidCallback">) {
    const filename = getFilename(context);

    if (!isTsxFile(filename) || isIgnoredFile(filename)) {
      return {};
    }

    const localObjectNames = new Set<string>();

    return {
      VariableDeclarator(node) {
        if (node.id?.type !== "Identifier") {
          return;
        }

        if (unwrapExpression(node.init)?.type !== "ObjectExpression") {
          return;
        }

        localObjectNames.add(node.id.name);
      },

      JSXAttribute(node) {
        const propName = getJsxAttributeName(node);

        if (!isJsxEventPropName(propName) || node.value?.type !== "JSXExpressionContainer") {
          return;
        }

        if (isAllowedCallbackExpression(node.value.expression, localObjectNames)) {
          return;
        }

        context.report({
          node: node.value,
          messageId: "invalidCallback",
          data: {
            propName,
          },
        });
      },
    };
  },
};

const plugin = {
  meta: {
    name: "template-jsx-callback",
  },
  rules: {
    "strict-jsx-callback-handler": strictJsxCallbackHandlerRule,
  },
};

export default plugin;
