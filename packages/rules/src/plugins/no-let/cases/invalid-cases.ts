import { outdent } from "outdent";
import type { InvalidRuleTestCase } from "../../../test-utils";

export const invalidCases = [
  {
    name: "rejects an initialized let declaration",
    code: outdent`
      let value = 1;
    `,
    errors: [{ messageId: "noLet" }],
  },
  {
    name: "rejects an uninitialized let declaration",
    code: outdent`
      let value;
    `,
    errors: [{ messageId: "noLet" }],
  },
] satisfies ReadonlyArray<InvalidRuleTestCase<"noLet">>;
