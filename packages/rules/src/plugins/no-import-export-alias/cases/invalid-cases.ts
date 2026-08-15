import { outdent } from "outdent";
import type { InvalidRuleTestCase } from "../../../test-utils";
import type { NoImportExportAliasOptions } from "../no-import-export-alias";

export const invalidCases = [
  {
    name: "rejects a named import alias",
    code: outdent`
      import { value as renamed } from "package";
    `,
    errors: [{ messageId: "noAlias" }],
  },
  {
    name: "rejects a redundant named import alias",
    code: outdent`
      import { value as value } from "package";
    `,
    errors: [{ messageId: "noAlias" }],
  },
  {
    name: "rejects a type-only import alias",
    code: outdent`
      import type { Value as Renamed } from "package";
    `,
    errors: [{ messageId: "noAlias" }],
  },
  {
    name: "rejects a namespace import",
    code: outdent`
      import * as packageNamespace from "package";
    `,
    errors: [{ messageId: "noAlias" }],
  },
  {
    name: "rejects a type-only namespace import",
    code: outdent`
      import type * as PackageNamespace from "package";
    `,
    errors: [{ messageId: "noAlias" }],
  },
  {
    name: "rejects a named export alias",
    code: outdent`
      export { value as renamed };
    `,
    errors: [{ messageId: "noAlias" }],
  },
  {
    name: "rejects a re-export alias",
    code: outdent`
      export { value as renamed } from "package";
    `,
    errors: [{ messageId: "noAlias" }],
  },
  {
    name: "still rejects named aliases when namespace imports are allowed",
    code: outdent`
      import { value as renamed } from "package";
    `,
    options: [{ allowNamespaceImports: true }],
    errors: [{ messageId: "noAlias" }],
  },
  {
    name: "rejects a namespace export",
    code: outdent`
      export * as packageNamespace from "package";
    `,
    errors: [{ messageId: "noAlias" }],
  },
] satisfies ReadonlyArray<InvalidRuleTestCase<"noAlias", NoImportExportAliasOptions>>;
