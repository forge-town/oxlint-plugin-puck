import { describe } from "vitest";
import plugin from "./no-process-env-outside-integration";
import { runRuleTests } from "../../test-utils";

const rule = plugin.rules["no-process-env-outside-integration"];

describe("no-process-env-outside-integration", () => {
  runRuleTests("no-process-env-outside-integration", rule, {
    valid: [
      {
        code: "const value = process.env.NODE_ENV;",
        filename: "/src/integrations/env/index.ts",
      },
      {
        code: "const value = process.env.NODE_ENV;",
        filename: "/src/integrations/server-env/index.ts",
      },
      {
        code: "const value = config.get('NODE_ENV');",
        filename: "/src/services/config.ts",
      },
      {
        code: "const other = process.arch;",
        filename: "/src/services/config.ts",
      },
    ],
    invalid: [
      {
        code: "const value = process.env.NODE_ENV;",
        filename: "/src/services/config.ts",
        errors: [{ messageId: "noProcessEnv" }],
      },
      {
        code: "const value = process.env.API_URL;",
        filename: "/src/utils.ts",
        errors: [{ messageId: "noProcessEnv" }],
      },
    ],
  });
});
