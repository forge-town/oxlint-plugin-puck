import noLetPlugin from "@repo/rules/no-let";
import noTryPlugin from "@repo/rules/no-try";

const plugin = {
  meta: {
    name: "puck",
  },
  rules: {
    "no-let": noLetPlugin.rules["no-let"],
    "no-try-catch": noTryPlugin.rules["no-try"],
  },
};

export default plugin;
