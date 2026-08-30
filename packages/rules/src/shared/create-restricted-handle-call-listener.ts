import { getCalleeName, getFilename, isHandleName, isTsxFile, normalizePath } from "@repo/rule-kit";
import type { OxlintRuleContext, TSESLint, TSESTree } from "../types";

type RestrictedHandleCallOptions<MessageId extends string> = {
  isRestrictedName: (name: string) => boolean;
  messageId: MessageId;
};

const isIgnoredFile = (filename: string): boolean => {
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
};

export const createRestrictedHandleCallListener = <MessageId extends string>(
  context: OxlintRuleContext<MessageId>,
  options: RestrictedHandleCallOptions<MessageId>
): TSESLint.RuleListener => {
  const filename = getFilename(context);

  if (!isTsxFile(filename) || isIgnoredFile(filename)) {
    return {};
  }

  const functionNames = new WeakMap<TSESTree.Node, string>();
  const handleFunctionStack: boolean[] = [];

  const enterFunction = (
    node:
      | TSESTree.FunctionDeclaration
      | TSESTree.FunctionExpression
      | TSESTree.ArrowFunctionExpression
  ): void => {
    const idName = node.type === "ArrowFunctionExpression" ? undefined : node.id?.name;
    const functionName = idName ?? functionNames.get(node) ?? "";
    handleFunctionStack.push(isHandleName(functionName));
  };

  const exitFunction = (): void => {
    handleFunctionStack.pop();
  };

  return {
    VariableDeclarator(node): void {
      if (
        node.id.type === "Identifier" &&
        (node.init?.type === "ArrowFunctionExpression" || node.init?.type === "FunctionExpression")
      ) {
        functionNames.set(node.init, node.id.name);
      }
    },

    FunctionDeclaration: enterFunction,
    "FunctionDeclaration:exit": exitFunction,
    FunctionExpression: enterFunction,
    "FunctionExpression:exit": exitFunction,
    ArrowFunctionExpression: enterFunction,
    "ArrowFunctionExpression:exit": exitFunction,

    CallExpression(node): void {
      if (!handleFunctionStack.at(-1)) {
        return;
      }

      const calleeName = getCalleeName(node.callee);

      if (!options.isRestrictedName(calleeName)) {
        return;
      }

      context.report({
        node: node.callee,
        messageId: options.messageId,
        data: {
          name: calleeName,
        },
      });
    },
  };
};
