import atomicComponentPlugin from "./plugins/atomic-component/atomic-component.ts";
import atomicSchemaPlugin from "./plugins/atomic-schema/atomic-schema.ts";
import jsxSortPropsPlugin from "./plugins/jsx-sort-props/jsx-sort-props.ts";
import newlineBeforeReturnPlugin from "./plugins/newline-before-return/newline-before-return.ts";
import noComponentHandlersPlugin from "./plugins/no-component-handlers/no-component-handlers.ts";
import noExplicitUnknownPlugin from "./plugins/no-explicit-unknown/no-explicit-unknown.ts";
import noHandleCallsHandlePlugin from "./plugins/no-handle-calls-handle/no-handle-calls-handle.ts";
import noHandleCallsOnPlugin from "./plugins/no-handle-calls-on/no-handle-calls-on.ts";
import noLetPlugin from "./plugins/no-let/no-let.ts";
import noProcessEnvOutsideIntegrationPlugin from "./plugins/no-process-env-outside-integration/no-process-env-outside-integration.ts";
import noTryPlugin from "./plugins/no-try/no-try.ts";
import noUseEffectPlugin from "./plugins/no-use-effect/no-use-effect.ts";
import noUseListDataFallbackPlugin from "./plugins/no-use-list-data-fallback/no-use-list-data-fallback.ts";
import strictJsxCallbackHandlerPlugin from "./plugins/strict-jsx-callback-handler/strict-jsx-callback-handler.ts";
import strictJsxHandlerVerbPlugin from "./plugins/strict-jsx-handler-verb/strict-jsx-handler-verb.ts";
import strictMethodModulePlugin from "./plugins/strict-method-module/strict-method-module.ts";

export const rules = {
  ...atomicComponentPlugin.rules,
  ...atomicSchemaPlugin.rules,
  ...jsxSortPropsPlugin.rules,
  ...newlineBeforeReturnPlugin.rules,
  ...noComponentHandlersPlugin.rules,
  ...noExplicitUnknownPlugin.rules,
  ...noHandleCallsHandlePlugin.rules,
  ...noHandleCallsOnPlugin.rules,
  ...noLetPlugin.rules,
  ...noProcessEnvOutsideIntegrationPlugin.rules,
  ...noTryPlugin.rules,
  ...noUseEffectPlugin.rules,
  ...noUseListDataFallbackPlugin.rules,
  ...strictJsxCallbackHandlerPlugin.rules,
  ...strictJsxHandlerVerbPlugin.rules,
  ...strictMethodModulePlugin.rules,
};
