import { describe } from "vitest";
import plugin from "./no-use-list-data-fallback.js";
import { runRuleTests } from "../../test-utils.js";

const rule = plugin.rules["no-use-list-data-fallback"];

describe("no-use-list-data-fallback", () => {
  runRuleTests("no-use-list-data-fallback", rule, {
    valid: [
      {
        code: "const data = useList({ resource: 'users' });",
      },
      {
        code: "const items = useList({ resource: 'users' }).data;",
      },
      {
        code: "const { result } = useList({ resource: 'users' });",
      },
      {
        code: "const value = otherList?.data ?? [];",
      },
    ],
    invalid: [
      {
        code: "const { result } = useList({ resource: 'users' });\nconst data = result.data ?? [];",
        errors: [{ messageId: "noFallback" }],
        output: "const { result } = useList({ resource: 'users' });\nconst data = result.data;",
      },
      {
        code: "const list = useList({ resource: 'users' });\nconst data = list.result.data ?? [];",
        errors: [{ messageId: "noFallback" }],
        output: "const list = useList({ resource: 'users' });\nconst data = list.result.data;",
      },
    ],
  });
});
