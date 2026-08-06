/**
 * @fileoverview Oxlint JS plugin: disallow handle callbacks from calling on callbacks.
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
    normalized.includes("/routes/api/") ||
    normalized.includes("/_store/") ||
    normalized.includes("/store/") ||
    /(?:^|\/)[A-Za-z0-9]+Store\.[cm]?tsx?$/.test(normalized) ||
    /(?:^|\/)[A-Za-z0-9]+Slice\.[cm]?tsx?$/.test(normalized)
  );
}

function unwrapExpression(node: TSESTree.Node): TSESTree.Node {
  if (node && (node.type === "ChainExpression" || node.type === "TSAsExpression" || node.type === "TSSatisfiesExpression" || node.type === "TSNonNullExpression")) {
    return unwrapExpression(node.expression);
  }

  return node;
}

function isHandleName(name: string): boolean {
  return /^handle[A-Z0-9]/.test(name);
}

function isOnName(name: string): boolean {
  return /^on[A-Z0-9]/.test(name);
}

function getCalleeName(callee: TSESTree.Node): string {
  const expression = unwrapExpression(callee);

  if (expression?.type === "Identifier") {
    return expression.name;
  }

  if (expression?.type === "MemberExpression") {
    if (expression.property?.type === "Identifier") {
      return expression.property.name;
    }

    if (expression.property?.type === "Literal") {
      return String(expression.property.value);
    }
  }

  return "";
}

const noHandleCallsOnRule: OxlintRuleModule<"noOnCall"> = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow handle callbacks from calling on callbacks",
    },
    messages: {
      noOnCall: "Do not call '{{name}}' inside a handle function. Pass props callbacks directly or wrap behavior in a non-on helper.",
    },
    schema: [],
  },
  create(context: OxlintRuleContext<"noOnCall">) {
    const filename = getFilename(context);

    if (!isTsxFile(filename) || isIgnoredFile(filename)) {
      return {};
    }

    const functionNames = new WeakMap<TSESTree.Node, string>();
    const handleFunctionStack: boolean[] = [];

    function enterFunction(node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression): void {
      const idName = node.type === "ArrowFunctionExpression" ? undefined : node.id?.name;
      const functionName = idName ?? functionNames.get(node) ?? "";
      handleFunctionStack.push(isHandleName(functionName));
    }

    function exitFunction(): void {
      handleFunctionStack.pop();
    }

    return {
      VariableDeclarator(node) {
        if (node.id.type === "Identifier" && (node.init?.type === "ArrowFunctionExpression" || node.init?.type === "FunctionExpression")) {
          functionNames.set(node.init, node.id.name);
        }
      },

      FunctionDeclaration: enterFunction,
      "FunctionDeclaration:exit": exitFunction,
      FunctionExpression: enterFunction,
      "FunctionExpression:exit": exitFunction,
      ArrowFunctionExpression: enterFunction,
      "ArrowFunctionExpression:exit": exitFunction,

      CallExpression(node) {
        if (!handleFunctionStack.at(-1)) {
          return;
        }

        const calleeName = getCalleeName(node.callee);

        if (!isOnName(calleeName)) {
          return;
        }

        context.report({
          node: node.callee,
          messageId: "noOnCall",
          data: {
            name: calleeName,
          },
        });
      },
    };
  },
};

const plugin = {
  meta: {
    name: "template-on-call",
  },
  rules: {
    "no-handle-calls-on": noHandleCallsOnRule,
  },
};

export default plugin;
