import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { OxlintRuleContext, OxlintRuleModule } from "../types.js";

/**
 * @fileoverview Oxlint JS plugin: enforce strict method module naming.
 */

const METHOD_FILE_PATTERN = /\/([^/]+)\.(?:helper|method)\.[cm]?[jt]sx?$/;

type SourceCodeWithFilename = { filename?: string };

const allowedVerbPrefixes = new Set([
  "add",
  "build",
  "calculate",
  "capture",
  "check",
  "cleanup",
  "compose",
  "complete",
  "convert",
  "create",
  "delete",
  "derive",
  "detect",
  "ensure",
  "fail",
  "fetch",
  "find",
  "format",
  "generate",
  "get",
  "handle",
  "has",
  "infer",
  "is",
  "list",
  "load",
  "make",
  "map",
  "normalize",
  "parse",
  "persist",
  "pipe",
  "prepare",
  "read",
  "remove",
  "render",
  "resolve",
  "save",
  "set",
  "should",
  "stream",
  "strip",
  "sync",
  "transform",
  "update",
  "validate",
  "write",
]);

function getFilename(context: OxlintRuleContext): string {
  return (
    context.filename ??
    context.physicalFilename ??
    context.getFilename?.() ??
    (context.sourceCode as SourceCodeWithFilename | undefined)?.filename ??
    ""
  );
}

function getMethodFileBaseName(filename: string): string | undefined {
  const normalized = filename.replaceAll("\\", "/");
  const match = normalized.match(METHOD_FILE_PATTERN);

  return match?.[1];
}

function isFunctionLikeNode(node: TSESTree.Node | null | undefined): boolean {
  return node?.type === "ArrowFunctionExpression" || node?.type === "FunctionExpression";
}

function isFunctionLikeExportDeclaration(node: TSESTree.Node | null | undefined): boolean {
  return node?.type === "FunctionDeclaration";
}

function isMethodName(name: string): boolean {
  const verb = [...allowedVerbPrefixes]
    .sort((left, right) => right.length - left.length)
    .find((prefix) => name.startsWith(prefix));

  if (!verb) {
    return false;
  }

  const noun = name.slice(verb.length);

  return /^[A-Z][\dA-Za-z]*$/.test(noun);
}

type NamedFunctionLike = {
  name: string;
  node: TSESTree.Identifier;
};

type RuntimeValueLike = {
  isFunctionLike: boolean;
  name: string;
  node: TSESTree.Identifier;
};

function collectVariableFunctionNames(node: TSESTree.Node | null | undefined): NamedFunctionLike[] {
  if (node?.type !== "VariableDeclaration") {
    return [];
  }

  return node.declarations
    .filter((declarator) => declarator.id?.type === "Identifier" && isFunctionLikeNode(declarator.init))
    .map((declarator) => ({
      name: (declarator.id as TSESTree.Identifier).name,
      node: declarator.id as TSESTree.Identifier,
    }));
}

function collectRuntimeValueNames(node: TSESTree.Node | null | undefined): RuntimeValueLike[] {
  if (node?.type === "VariableDeclaration") {
    return node.declarations
      .filter((declarator) => declarator.id?.type === "Identifier")
      .map((declarator) => ({
        isFunctionLike: isFunctionLikeNode(declarator.init),
        name: (declarator.id as TSESTree.Identifier).name,
        node: declarator.id as TSESTree.Identifier,
      }));
  }

  if (node?.type === "FunctionDeclaration" && node.id?.type === "Identifier") {
    return [
      {
        isFunctionLike: true,
        name: node.id.name,
        node: node.id,
      },
    ];
  }

  return [];
}

type ExportSpecifierLike = {
  exportedName: string;
  localName: string;
  node: TSESTree.Identifier;
};

function collectExportSpecifiers(node: TSESTree.ExportNamedDeclaration): ExportSpecifierLike[] {
  return (node.specifiers ?? [])
    .filter((specifier) => specifier.local?.type === "Identifier")
    .map((specifier) => ({
      exportedName:
        specifier.exported?.type === "Identifier"
          ? specifier.exported.name
          : (specifier.local as TSESTree.Identifier).name,
      localName: (specifier.local as TSESTree.Identifier).name,
      node: specifier.local as TSESTree.Identifier,
    }));
}

const strictMethodModuleRule: OxlintRuleModule<
  "extraRuntimeExport" | "invalidMethodName" | "multipleMethodExports" | "mismatchedFileName"
> = {
  meta: {
    type: "problem",
    docs: {
      description: "Require method/helper modules to export one verb+noun method matching the file name",
    },
    messages: {
      extraRuntimeExport:
        "Method file '{{fileName}}' exports method '{{methodName}}' and another runtime value '{{exportName}}'. Keep one runtime method export per method file.",
      invalidMethodName:
        "Method name '{{methodName}}' must be verb+noun lowerCamelCase, such as createUser or resolveRuntimeConfig.",
      multipleMethodExports:
        "Method file '{{fileName}}' must export exactly one runtime method. Found {{count}} exported methods.",
      mismatchedFileName:
        "Method file '{{fileName}}' must match exported method '{{methodName}}'. Rename the file to '{{methodName}}.{{suffix}}'.",
    },
    schema: [],
  },
  create(context: OxlintRuleContext) {
    const filename = getFilename(context);
    const fileBaseName = getMethodFileBaseName(filename);

    if (!fileBaseName) {
      return {};
    }

    const suffix = filename.includes(".method.") ? "method.ts" : "helper.ts";
    const exportSpecifiers: ExportSpecifierLike[] = [];
    const exportedRuntimeValues: RuntimeValueLike[] = [];
    const exportedMethods: RuntimeValueLike[] = [];

    return {
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration) {
        exportSpecifiers.push(...collectExportSpecifiers(node));

        const runtimeValues = collectRuntimeValueNames(node.declaration);

        for (const runtimeValue of runtimeValues) {
          exportedRuntimeValues.push(runtimeValue);

          if (runtimeValue.isFunctionLike) {
            exportedMethods.push(runtimeValue);
          }
        }
      },
      "Program:exit"(node: TSESTree.Program) {
        const topLevelFunctionNames = new Map<string, NamedFunctionLike>();

        for (const statement of node.body) {
          const functionNames = collectVariableFunctionNames(statement);

          for (const functionName of functionNames) {
            topLevelFunctionNames.set(functionName.name, functionName);

            if (!isMethodName(functionName.name)) {
              context.report({
                data: {
                  methodName: functionName.name,
                },
                messageId: "invalidMethodName",
                node: functionName.node,
              });
            }
          }

          if (statement.type === "FunctionDeclaration" && statement.id?.type === "Identifier" && !isMethodName(statement.id.name)) {
            context.report({
              data: {
                methodName: statement.id.name,
              },
              messageId: "invalidMethodName",
              node: statement.id,
            });
          }
        }

        for (const exportSpecifier of exportSpecifiers) {
          const topLevelFunction = topLevelFunctionNames.get(
            exportSpecifier.localName,
          );

          if (!topLevelFunction) {
            continue;
          }

          const exportedMethod: RuntimeValueLike = {
            isFunctionLike: true,
            name: exportSpecifier.exportedName,
            node: exportSpecifier.node,
          };

          exportedRuntimeValues.push(exportedMethod);
          exportedMethods.push(exportedMethod);
        }

        if (exportedMethods.length === 0) {
          return;
        }

        for (const exportedMethod of exportedMethods) {
          if (!isMethodName(exportedMethod.name)) {
            context.report({
              data: {
                methodName: exportedMethod.name,
              },
              messageId: "invalidMethodName",
              node: exportedMethod.node,
            });
          }
        }

        if (exportedMethods.length > 1) {
          context.report({
            data: {
              count: String(exportedMethods.length),
              fileName: fileBaseName,
            },
            messageId: "multipleMethodExports",
            node,
          });
        }

        const [exportedMethod] = exportedMethods;

        if (exportedMethod && exportedMethod.name !== fileBaseName) {
          context.report({
            data: {
              fileName: fileBaseName,
              methodName: exportedMethod.name,
              suffix,
            },
            messageId: "mismatchedFileName",
            node: exportedMethod.node,
          });
        }

        for (const exportedValue of exportedRuntimeValues) {
          if (exportedValue.isFunctionLike) {
            continue;
          }

          context.report({
            data: {
              exportName: exportedValue.name,
              fileName: fileBaseName,
              methodName: exportedMethod?.name ?? "",
            },
            messageId: "extraRuntimeExport",
            node: exportedValue.node,
          });
        }
      },
    };
  },
};

const plugin = {
  meta: {
    name: "template-method",
  },
  rules: {
    "strict-method-module": strictMethodModuleRule,
  },
};

export default plugin;
