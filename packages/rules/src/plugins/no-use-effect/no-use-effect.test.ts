import { describe } from "vitest";
import plugin from "./no-use-effect";
import { runRuleTests } from "../../test-utils";

const rule = plugin.rules["no-use-effect"];

describe("no-use-effect", () => {
  runRuleTests("no-use-effect", rule, {
    valid: [
      "useMemo(() => 1, []);",
      "useState(0);",
      "function useEffectFallback() {}",
      "const effect = 'not-a-hook';",
      "fetch('/api');",
    ],
    invalid: [
      {
        code: "useEffect(() => {}, []);",
        errors: [{ messageId: "noUseEffect" }],
      },
      {
        code: "useLayoutEffect(() => {}, []);",
        errors: [{ messageId: "noUseEffect" }],
      },
      {
        code: "runClientLayout(() => {});",
        errors: [{ messageId: "noUseEffect" }],
      },
      {
        code: "useCustomEffect(() => {});",
        errors: [{ messageId: "noUseEffect" }],
      },
      {
        code: "React.useEffect(() => {}, []);",
        errors: [{ messageId: "noUseEffect" }, { messageId: "noUseEffect" }],
      },
      {
        code: "const fn = useEffect;",
        errors: [{ messageId: "noUseEffect" }],
      },
    ],
  });
});
