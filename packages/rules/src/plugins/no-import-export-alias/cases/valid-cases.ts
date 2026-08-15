import { outdent } from "outdent";
import type { ValidRuleTestCase } from "../../../test-utils";
import type { NoImportExportAliasOptions } from "../no-import-export-alias";

export const validCases = [
  {
    name: "accepts direct named imports",
    code: outdent`
      import { value } from "package";
    `,
  },
  {
    name: "accepts default and side-effect imports",
    code: outdent`
      import value from "package";
      import "setup";
    `,
  },
  {
    name: "accepts direct named and star exports",
    code: outdent`
      export { value };
      export { other } from "package";
      export * from "another-package";
    `,
  },
  {
    name: "accepts TypeScript assertions and object aliases",
    code: outdent`
      const normalized = value as string;
      const { value: renamed } = source;
    `,
  },
  {
    name: "accepts namespace imports when configured",
    code: outdent`
      import * as packageNamespace from "package";
      import type * as PackageTypes from "types-package";
    `,
    options: [{ allowNamespaceImports: true }],
  },
] satisfies ReadonlyArray<ValidRuleTestCase<NoImportExportAliasOptions>>;
