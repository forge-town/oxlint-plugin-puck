/**
 * @fileoverview Oxlint JS plugin: disallow handle callbacks from calling on callbacks.
 */

import { isOnName } from "@repo/rule-kit";
import { createRestrictedHandleCallListener } from "../../shared/create-restricted-handle-call-listener";
import type { OxlintRuleContext, OxlintRuleModule } from "../../types";

const noHandleCallsOnRule: OxlintRuleModule<"noOnCall"> = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow handle callbacks from calling on callbacks",
    },
    messages: {
      noOnCall:
        "Do not call '{{name}}' inside a handle function. Pass props callbacks directly or wrap behavior in a non-on helper.",
    },
    schema: [],
  },
  create(context: OxlintRuleContext<"noOnCall">) {
    return createRestrictedHandleCallListener(context, {
      isRestrictedName: isOnName,
      messageId: "noOnCall",
    });
  },
};

const plugin = {
  meta: {
    name: "template-on-call",
  },
  rules: {
    "no-handle-calls-on": noHandleCallsOnRule,
  },
};

export default plugin;
