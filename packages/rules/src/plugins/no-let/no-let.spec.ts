import plugin from "./no-let";
import { createRuleTester } from "../../test-utils";
import { invalidCases } from "./cases/invalid-cases";
import { validCases } from "./cases/valid-cases";

const rule = plugin.rules["no-let"];

createRuleTester().run("no-let", rule, {
  valid: validCases,
  invalid: invalidCases,
});
