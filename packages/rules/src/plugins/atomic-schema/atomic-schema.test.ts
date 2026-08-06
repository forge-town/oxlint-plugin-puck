import { describe } from "vitest";
import plugin from "./atomic-schema.js";
import { runRuleTests } from "../../test-utils.js";

const rule = plugin.rules["atomic-schema"];

describe("atomic-schema", () => {
  runRuleTests("atomic-schema", rule, {
    valid: [
      {
        code: `
          import { z } from "zod";
          export const UserSchema = z.object({ id: z.string() });
        `,
        filename: "src/schemas/User.schema.ts",
      },
      {
        code: `
          export { UserSchema } from "./User.schema";
          export type { User } from "./User.schema";
        `,
        filename: "src/schemas/index.ts",
      },
      {
        code: "export { UserSchema } from \"./User.schema\";",
        filename: "src/schemas/UsersSchemas.ts",
      },
      {
        code: `
          import { z } from "zod";
          export const UserSchema = z.object({});
        `,
        filename: "/packages/schemas/src/User.schema.ts",
      },
    ],
    invalid: [
      {
        code: "const x = 1;",
        filename: "src/schemas/anything.ts",
        errors: [{ messageId: "invalidSchemaFileName" }],
      },
      {
        code: `
          import { z } from "zod";
          export const UserSchema = z.object({ id: z.string() });
        `,
        filename: "src/schemas/not-schema-format.txt.ts",
        errors: [{ messageId: "invalidSchemaFileName" }],
      },
      {
        code: `
          import { z } from "zod";
          export const UserSchema = z.object({ id: z.string() });
        `,
        filename: "src/schemas/index.ts",
        errors: [{ messageId: "moduleHasLocalDeclarations" }],
      },
      {
        code: `
          import { z } from "zod";
          export const UserSchema = z.object({ id: z.string() });
        `,
        filename: "/packages/schemas/src/schema.ts",
        errors: [{ messageId: "schemaFileName" }],
      },
      {
        code: "const helper = () => 1; export { helper };",
        filename: "src/schemas/User.schema.ts",
        errors: [
          { messageId: "missingZodSchema" },
          { messageId: "missingZodImport" },
        ],
      },
      {
        code: `
          export const UserSchema = z.object({ id: z.string() });
        `,
        filename: "src/schemas/User.schema.ts",
        errors: [{ messageId: "missingZodImport" }],
      },
      {
        code: `
          import { z } from "zod";
          export const UserSchema = 1;
        `,
        filename: "src/schemas/User.schema.ts",
        errors: [{ messageId: "missingZodImport" }],
      },
      {
        code: `
          export const helperFn = () => 1;
          export const otherFn = () => 2;
        `,
        filename: "src/schemas/User.schema.ts",
        errors: [
          { messageId: "missingZodSchema" },
          { messageId: "missingZodImport" },
          { messageId: "mismatchedExport" },
        ],
      },
    ],
  });
});
