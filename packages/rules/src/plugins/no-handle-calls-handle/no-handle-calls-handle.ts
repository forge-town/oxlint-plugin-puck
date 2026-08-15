/**
 * @fileoverview Oxlint JS plugin: disallow handle callbacks from calling other handle callbacks.
 */

import { isHandleName } from "@repo/rule-kit";
import { createRestrictedHandleCallListener } from "../../shared/create-restricted-handle-call-listener";
import type { OxlintRuleContext, OxlintRuleModule } from "../../types";

const noHandleCallsHandleRule: OxlintRuleModule<"noHandleCall"> = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow handle callbacks from calling other handle callbacks",
    },
    messages: {
      noHandleCall:
        "Do not call '{{name}}' inside a handle function. Move the shared behavior into a non-handle helper.",
    },
    schema: [],
  },
  create(context: OxlintRuleContext<"noHandleCall">) {
    return createRestrictedHandleCallListener(context, {
      isRestrictedName: isHandleName,
      messageId: "noHandleCall",
    });
  },
};

const plugin = {
  meta: {
    name: "template-handle-call",
  },
  rules: {
    "no-handle-calls-handle": noHandleCallsHandleRule,
  },
};

export default plugin;
