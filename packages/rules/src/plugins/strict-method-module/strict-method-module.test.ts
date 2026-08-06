import { describe } from "vitest";
import plugin from "./strict-method-module.js";
import { runRuleTests } from "../../test-utils.js";

const rule = plugin.rules["strict-method-module"];

describe("strict-method-module", () => {
  runRuleTests("strict-method-module", rule, {
    valid: [
      {
        code: "export function createUser(): void {}",
        filename: "src/methods/createUser.method.ts",
      },
      {
        code: "export const resolveRuntimeConfig = (): void => {};",
        filename: "src/helpers/resolveRuntimeConfig.helper.ts",
      },
      {
        code: "const parseInput = () => {}; export { parseInput };",
        filename: "src/helpers/parseInput.helper.ts",
      },
      {
        code: "export type User = { id: string };",
        filename: "src/methods/createUser.method.ts",
      },
      {
        code: "export function createUser(): void {}",
        filename: "src/lib/not-a-method.ts",
      },
    ],
    invalid: [
      {
        code: "export function notVerbNoun(): void {}",
        filename: "src/methods/notVerbNoun.method.ts",
        errors: [{ messageId: "invalidMethodName" }],
      },
      {
        code: "export function createUser(): void {}",
        filename: "src/methods/createAnotherUser.method.ts",
        errors: [{ messageId: "mismatchedFileName" }],
      },
      {
        code: "const helper = () => {}; export { helper as parseInput };",
        filename: "src/helpers/parseInput.helper.ts",
        errors: [{ messageId: "invalidMethodName" }],
      },
      {
        code: "export function createUser(): void {} export function updateUser(): void {}",
        filename: "src/methods/createUser.method.ts",
        errors: [{ messageId: "multipleMethodExports" }],
      },
      {
        code: "export const createUser = (): void => {}; export const MAX = 10;",
        filename: "src/methods/createUser.method.ts",
        errors: [{ messageId: "extraRuntimeExport" }],
      },
    ],
  });
});
