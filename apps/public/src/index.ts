import noLetPlugin from "@repo/rules/no-let";
import noTryPlugin from "@repo/rules/no-try";
import noUseEffectPlugin from "@repo/rules/no-use-effect";
import newlineBeforeReturnPlugin from "@repo/rules/newline-before-return";
import jsxSortPropsPlugin from "@repo/rules/jsx-sort-props";

const plugin = {
  meta: {
    name: "puck",
  },
  rules: {
    "no-let": noLetPlugin.rules["no-let"],
    "no-try-catch": noTryPlugin.rules["no-try"],
    "no-use-effect": noUseEffectPlugin.rules["no-use-effect"],
    "newline-before-return": newlineBeforeReturnPlugin.rules["newline-before-return"],
    "jsx-sort-props": jsxSortPropsPlugin.rules["jsx-sort-props"],
  },
};

export default plugin;
