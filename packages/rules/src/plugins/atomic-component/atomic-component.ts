import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { OxlintRuleContext, OxlintRuleModule } from "../../types.js";

/**
 * @fileoverview Oxlint JS plugin: enforce atomic React component modules.
 */

type SourceCodeWithFilename = { filename?: string };

function getFilename(context: OxlintRuleContext): string {
  return (
    context.filename ??
    context.physicalFilename ??
    context.getFilename?.() ??
    (context.sourceCode as SourceCodeWithFilename | undefined)?.filename ??
    ""
  );
}

function normalizePath(filename: string): string {
  return filename.replaceAll("\\", "/");
}

function getPathSegments(filename: string): string[] {
  return normalizePath(filename).split("/");
}

function getBasename(filename: string): string {
  const segments = getPathSegments(filename);

  return segments.at(-1) ?? "";
}

function removeExtension(filename: string): string {
  return filename.replace(/\.[cm]?[jt]sx?$/, "");
}

function isTsxFile(filename: string): boolean {
  return normalizePath(filename).endsWith(".tsx");
}

function isPascalCaseName(name: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

function isIgnoredFile(filename: string): boolean {
  const normalized = normalizePath(filename);

  return (
    normalized.includes("/__spec__/") ||
    normalized.includes("/__tests__/") ||
    normalized.includes("/e2e/") ||
    normalized.includes("/routes/") ||
    normalized.includes("/_store/") ||
    normalized.includes("/store/") ||
    /\.(?:test|spec|stories)\.tsx$/.test(normalized)
  );
}

function getExpectedComponentName(filename: string): string {
  const fileName = getBasename(filename);
  const moduleName = removeExtension(fileName);

  if (moduleName !== "index") {
    return isPascalCaseName(moduleName) ? moduleName : "";
  }

  const segments = getPathSegments(filename);
  const parentName = segments.at(-2) ?? "";

  return isPascalCaseName(parentName) ? parentName : "";
}

function unwrapExpression(node: TSESTree.Node | null | undefined): TSESTree.Node | null | undefined {
  if (
    node &&
    (node.type === "ChainExpression" ||
      node.type === "TSAsExpression" ||
      node.type === "TSSatisfiesExpression" ||
      node.type === "TSNonNullExpression" ||
      node.type === "TSInstantiationExpression")
  ) {
    return unwrapExpression(node.expression);
  }

  return node;
}

function getStaticPropertyName(node: TSESTree.Node | null | undefined): string {
  if (!node) {
    return "";
  }

  if (node.type === "Identifier") {
    return node.name;
  }

  if (node.type === "Literal") {
    return String(node.value);
  }

  return "";
}

function getCalleeName(callee: TSESTree.Node): string {
  const expression = unwrapExpression(callee);

  if (expression?.type === "Identifier") {
    return expression.name;
  }

  if (expression?.type === "MemberExpression") {
    return getStaticPropertyName(expression.property);
  }

  return "";
}

function isComponentWrapperCall(node: TSESTree.CallExpression): boolean {
  const calleeName = getCalleeName(node.callee);

  return calleeName === "memo" || calleeName === "forwardRef";
}

function getFunctionExpression(
  node: TSESTree.Node | null | undefined,
): TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression | null {
  const expression = unwrapExpression(node);

  if (expression?.type === "ArrowFunctionExpression" || expression?.type === "FunctionExpression") {
    return expression;
  }

  if (expression?.type !== "CallExpression" || !isComponentWrapperCall(expression)) {
    return null;
  }

  return getFunctionExpression(expression.arguments?.[0]);
}

function containsJsx(node: unknown, seen = new WeakSet<object>()): boolean {
  if (!node || typeof node !== "object") {
    return false;
  }

  if (seen.has(node)) {
    return false;
  }

  seen.add(node);

  if ((node as TSESTree.Node).type === "JSXElement" || (node as TSESTree.Node).type === "JSXFragment") {
    return true;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === "parent" || key === "loc" || key === "range" || key === "start" || key === "end") {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.some((item) => containsJsx(item, seen))) {
        return true;
      }

      continue;
    }

    if (containsJsx(value, seen)) {
      return true;
    }
  }

  return false;
}

function functionReturnsJsx(
  functionNode:
    | TSESTree.FunctionDeclaration
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionExpression,
): boolean {
  const body = unwrapExpression(functionNode.body);

  if (!body) {
    return false;
  }

  if (body.type !== "BlockStatement") {
    return containsJsx(body);
  }

  return body.body.some(
    (statement) => statement.type === "ReturnStatement" && containsJsx(statement.argument),
  );
}

function getDeclarationName(declaration: TSESTree.Node | null | undefined): string {
  if (
    declaration?.type === "FunctionDeclaration" ||
    declaration?.type === "TSInterfaceDeclaration" ||
    declaration?.type === "TSTypeAliasDeclaration"
  ) {
    return declaration.id?.name ?? "";
  }

  return "";
}

function getExportSpecifierName(specifier: TSESTree.ExportSpecifier): string {
  return specifier.exported?.type === "Identifier"
    ? specifier.exported.name
    : specifier.local?.type === "Identifier"
      ? specifier.local.name
      : "";
}

function getExportKind(
  statement: TSESTree.ExportNamedDeclaration,
  specifier?: TSESTree.ExportSpecifier,
): "type" | "value" {
  if (statement.exportKind === "type" || specifier?.exportKind === "type") {
    return "type";
  }

  if (
    statement.declaration?.type === "TSInterfaceDeclaration" ||
    statement.declaration?.type === "TSTypeAliasDeclaration"
  ) {
    return "type";
  }

  return "value";
}

type LocalDeclaration = {
  name: string;
  node: TSESTree.Node;
  returnsJsx: boolean;
  type: string;
};

function collectVariableDeclarations(
  declaration: TSESTree.VariableDeclaration,
  declarations: LocalDeclaration[],
): void {
  for (const declarator of declaration.declarations ?? []) {
    if (declarator.id?.type !== "Identifier") {
      continue;
    }

    const functionExpression = getFunctionExpression(declarator.init);

    declarations.push({
      name: declarator.id.name,
      node: declarator.id,
      returnsJsx: functionExpression ? functionReturnsJsx(functionExpression) : false,
      type: "variable",
    });
  }
}

function collectLocalDeclarations(program: TSESTree.Program): LocalDeclaration[] {
  const declarations: LocalDeclaration[] = [];

  for (const statement of program.body) {
    const declaration =
      statement.type === "ExportNamedDeclaration" ? statement.declaration : statement;

    if (declaration?.type === "VariableDeclaration") {
      collectVariableDeclarations(declaration, declarations);
      continue;
    }

    const name = getDeclarationName(declaration);

    if (!name) {
      continue;
    }

    const namedDeclaration = declaration as
      | TSESTree.FunctionDeclaration
      | TSESTree.TSInterfaceDeclaration
      | TSESTree.TSTypeAliasDeclaration;

    declarations.push({
      name,
      node: namedDeclaration.id ?? namedDeclaration,
      returnsJsx:
        namedDeclaration.type === "FunctionDeclaration"
          ? functionReturnsJsx(namedDeclaration)
          : false,
      type: namedDeclaration.type,
    });
  }

  return declarations;
}

type LocalExport = {
  kind: "type" | "value";
  name: string;
  node: TSESTree.Node;
};

function collectLocalExports(program: TSESTree.Program): LocalExport[] {
  const exports: LocalExport[] = [];

  for (const statement of program.body) {
    if (
      statement.type === "ExportDefaultDeclaration" ||
      statement.type === "ExportAllDeclaration"
    ) {
      exports.push({ kind: "value", name: "default", node: statement });
      continue;
    }

    if (statement.type !== "ExportNamedDeclaration" || statement.source) {
      continue;
    }

    if (statement.declaration?.type === "VariableDeclaration") {
      for (const declarator of statement.declaration.declarations ?? []) {
        if (declarator.id?.type === "Identifier") {
          exports.push({ kind: "value", name: declarator.id.name, node: declarator.id });
        }
      }

      continue;
    }

    const declarationName = getDeclarationName(statement.declaration);

    if (declarationName) {
      const namedDeclaration = statement.declaration as
        | TSESTree.FunctionDeclaration
        | TSESTree.TSInterfaceDeclaration
        | TSESTree.TSTypeAliasDeclaration;

      exports.push({
        kind: getExportKind(statement),
        name: declarationName,
        node: namedDeclaration.id ?? namedDeclaration,
      });

      continue;
    }

    for (const specifier of statement.specifiers ?? []) {
      const name = getExportSpecifierName(specifier);

      if (name) {
        exports.push({ kind: getExportKind(statement, specifier), name, node: specifier });
      }
    }
  }

  return exports;
}

const atomicComponentRule: OxlintRuleModule<
  "invalidExport" | "missingComponentExport" | "multipleComponentDeclarations" | "nonJsxComponent"
> = {
  meta: {
    type: "problem",
    docs: {
      description: "Require component files to export only their props and same-name JSX component",
    },
    messages: {
      invalidExport:
        "Atomic component files may only export '{{propsName}}' and '{{componentName}}'; remove '{{exportName}}'.",
      missingComponentExport:
        "Atomic component file '{{fileName}}' must export the same-name component '{{componentName}}'.",
      multipleComponentDeclarations:
        "Atomic component file '{{fileName}}' must declare '{{componentName}}' only once.",
      nonJsxComponent: "Exported component '{{componentName}}' must return JSX.",
    },
    schema: [],
  },
  create(context: OxlintRuleContext): TSESLint.RuleListener {
    const filename = getFilename(context);

    if (!isTsxFile(filename) || isIgnoredFile(filename)) {
      return {};
    }

    const componentName = getExpectedComponentName(filename);

    if (!componentName) {
      return {};
    }

    const propsName = `${componentName}Props`;

    return {
      Program(program: TSESTree.Program): void {
        const declarations = collectLocalDeclarations(program);
        const localExports = collectLocalExports(program);
        const allowedExportNames = new Set([componentName, propsName]);
        const componentDeclarations = declarations.filter((item) => item.name === componentName);
        const componentExport = localExports.find(
          (item) => item.kind === "value" && item.name === componentName,
        );

        for (const localExport of localExports) {
          if (!allowedExportNames.has(localExport.name)) {
            context.report({
              node: localExport.node,
              messageId: "invalidExport",
              data: {
                componentName,
                exportName: localExport.name,
                propsName,
              },
            });
          }
        }

        if (!componentExport) {
          context.report({
            node: program,
            messageId: "missingComponentExport",
            data: {
              componentName,
              fileName: getBasename(filename),
            },
          });
        }

        if (componentDeclarations.length > 1) {
          context.report({
            node: componentDeclarations[1]!.node,
            messageId: "multipleComponentDeclarations",
            data: {
              componentName,
              fileName: getBasename(filename),
            },
          });
        }

        if (componentExport && !componentDeclarations.some((item) => item.returnsJsx)) {
          context.report({
            node: componentExport.node,
            messageId: "nonJsxComponent",
            data: {
              componentName,
            },
          });
        }
      },
    };
  },
};

const plugin = {
  meta: {
    name: "template-component",
  },
  rules: {
    "atomic-component": atomicComponentRule,
  },
};

export default plugin;
