import { outdent } from "outdent";
import type { ValidRuleTestCase } from "../../../test-utils";

export const validCases = [
  {
    name: "accepts a const declaration",
    code: outdent`
      const value = 1;
    `,
  },
  {
    name: "accepts const destructuring",
    code: outdent`
      const [first, second] = values;
    `,
  },
  {
    name: "accepts a const for-of binding",
    code: outdent`
      for (const item of items) {
        consume(item);
      }
    `,
  },
] satisfies ReadonlyArray<ValidRuleTestCase>;
