import { createRuleTester } from "../../test-utils";
import { invalidCases } from "./cases/invalid-cases";
import { validCases } from "./cases/valid-cases";
import plugin from "./no-import-export-alias";

const rule = plugin.rules["no-import-export-alias"];

createRuleTester().run("no-import-export-alias", rule, {
  valid: validCases,
  invalid: invalidCases,
});
