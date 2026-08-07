export type RuleMessage = {
  id: string;
  text: string;
};

export type RuleOption = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export type RuleExample = {
  title: string;
  code: string;
  valid: boolean;
};

export type RuleInfo = {
  id: string;
  name: string;
  title: string;
  plugin: string;
  pluginKey: string;
  description: string;
  details: string;
  type: "problem" | "suggestion" | "layout";
  fixable?: "code" | "whitespace";
  scope?: string;
  ignores?: string[];
  messages: RuleMessage[];
  options?: RuleOption[];
  examples: RuleExample[];
};

export const rules = [
  {
    id: "atomic-component",
    name: "atomic-component",
    title: "原子组件模块",
    plugin: "puck",
    pluginKey: "puck/atomic-component",
    description: "Require component files to export only their props and same-name JSX component.",
    details:
      "强制每个 .tsx 组件文件只导出同名的组件及其 Props 类型。禁止导出额外运行时值、声明多个同名组件、或导出非 JSX 组件，使组件文件保持单一职责的原子单元。",
    type: "problem",
    scope: ".tsx 组件文件（非 index 模块时文件/目录名需为 PascalCase）",
    ignores: [
      "/__spec__/",
      "/__tests__/",
      "/e2e/",
      "/routes/",
      "/_store/",
      "/store/",
      "*.test.tsx",
      "*.spec.tsx",
      "*.stories.tsx",
    ],
    messages: [
      {
        id: "invalidExport",
        text: "Atomic component files may only export '{{propsName}}' and '{{componentName}}'; remove '{{exportName}}'.",
      },
      {
        id: "missingComponentExport",
        text: "Atomic component file '{{fileName}}' must export the same-name component '{{componentName}}'.",
      },
      {
        id: "multipleComponentDeclarations",
        text: "Atomic component file '{{fileName}}' must declare '{{componentName}}' only once.",
      },
      { id: "nonJsxComponent", text: "Exported component '{{componentName}}' must return JSX." },
    ],
    examples: [
      {
        title: "❌ 导出额外运行时值",
        valid: false,
        code: `// Button.tsx
export const Button = () => <button>OK</button>;
export const useButton = () => ({});`,
      },
      {
        title: "✅ 只导出组件与 Props",
        valid: true,
        code: `// Button.tsx
export type ButtonProps = { children: ReactNode };
export const Button = ({ children }: ButtonProps) => <button>{children}</button>;`,
      },
    ],
  },
  {
    id: "atomic-schema",
    name: "atomic-schema",
    title: "原子 Schema 模块",
    plugin: "puck",
    pluginKey: "puck/atomic-schema",
    description: "Require schema concepts to live in atomic schema modules.",
    details:
      "把 schema 概念拆成原子文件：每个概念放在 `schemas/Xxx.schema.ts`，只导出一个 zod schema 值。禁止在 `schema.ts` 或 `schemas/index.ts` 中写本地声明，保持 schema 层清晰可检索。",
    type: "problem",
    scope: "/packages/schemas/src/、/schemas/ 或名为 schema.ts 的文件",
    messages: [
      {
        id: "indexHasLocalExports",
        text: "Schema index files must only re-export atomic schema modules; move local declarations into their own file.",
      },
      {
        id: "schemaFileName",
        text: "Do not declare schema concepts in a generic schema.ts file; move each concept into schemas/<ConceptName>.schema.ts.",
      },
      {
        id: "invalidSchemaFileName",
        text: "Files inside schemas/ must be named Xxx.schema.ts, index.ts, or XxxSchemas.ts.",
      },
      {
        id: "moduleHasLocalDeclarations",
        text: "Schema module files must only re-export atomic schema files.",
      },
      {
        id: "mismatchedExport",
        text: "Schema module '{{fileName}}' must be atomic; move '{{exportName}}' into its own schema module.",
      },
      {
        id: "missingZodSchema",
        text: "Atomic schema files must export exactly one zod schema value named XxxSchema.",
      },
      {
        id: "missingZodImport",
        text: "Atomic schema files must define the exported XxxSchema value with zod.",
      },
    ],
    examples: [
      {
        title: "❌ 通用 schema.ts 包含多个概念",
        valid: false,
        code: `// schemas/schema.ts
import { z } from "zod";
export const UserSchema = z.object({ name: z.string() });
export const PostSchema = z.object({ title: z.string() });`,
      },
      {
        title: "✅ 每个概念一个原子文件",
        valid: true,
        code: `// schemas/User.schema.ts
import { z } from "zod";
export const UserSchema = z.object({ name: z.string() });`,
      },
    ],
  },
  {
    id: "jsx-sort-props",
    name: "jsx-sort-props",
    title: "JSX 属性排序",
    plugin: "puck",
    pluginKey: "puck/jsx-sort-props",
    description: "Enforce props alphabetical sorting.",
    details:
      "强制 JSX 属性按一致顺序排列。支持回调置后、简写置前/后、多行置前/后、保留属性优先、自定义优先列表、忽略大小写与本地化排序，并提供自动修复。",
    type: "suggestion",
    fixable: "code",
    messages: [
      {
        id: "noUnreservedProps",
        text: "A customized reserved first list must only contain a subset of React reserved props. Remove: {{unreservedWords}}",
      },
      { id: "listIsEmpty", text: "A customized reserved first list must not be empty" },
      {
        id: "listReservedPropsFirst",
        text: "Reserved props must be listed before all other props",
      },
      { id: "listCallbacksLast", text: "Callbacks must be listed after all other props" },
      { id: "listShorthandFirst", text: "Shorthand props must be listed before all other props" },
      { id: "listShorthandLast", text: "Shorthand props must be listed after all other props" },
      { id: "listMultilineFirst", text: "Multiline props must be listed before all other props" },
      { id: "listMultilineLast", text: "Multiline props must be listed after all other props" },
      {
        id: "listSortFirstPropsFirst",
        text: "Props in sortFirst must be listed before all other props",
      },
      { id: "sortPropsByAlpha", text: "Props should be sorted alphabetically" },
    ],
    options: [
      { name: "callbacksLast", type: "boolean", description: "事件回调属性排在最后。" },
      { name: "shorthandFirst", type: "boolean", description: "简写属性排在最前。" },
      { name: "shorthandLast", type: "boolean", description: "简写属性排在最后。" },
      {
        name: "multiline",
        type: "'ignore' | 'first' | 'last'",
        default: "ignore",
        description: "多行属性的排序策略。",
      },
      { name: "ignoreCase", type: "boolean", description: "排序时忽略大小写。" },
      {
        name: "noSortAlphabetically",
        type: "boolean",
        description: "关闭字母排序，仅使用其它排序规则。",
      },
      {
        name: "reservedFirst",
        type: "boolean | string[]",
        default: "false",
        description:
          "保留属性（children/ref/key/dangerouslySetInnerHTML）是否排在最前；传入数组可自定义子集。",
      },
      { name: "sortFirst", type: "string[]", description: "自定义必须排在最前的属性列表。" },
      {
        name: "locale",
        type: "string",
        default: "auto",
        description: "localeCompare 使用的 locale。",
      },
    ],
    examples: [
      {
        title: "❌ 属性顺序混乱",
        valid: false,
        code: `<Button onClick={handleClick} b={2} a={1}>
  Click
</Button>`,
      },
      {
        title: "✅ 排序后（callbacksLast）",
        valid: true,
        code: `<Button a={1} b={2} onClick={handleClick}>
  Click
</Button>`,
      },
    ],
  },
  {
    id: "newline-before-return",
    name: "newline-before-return",
    title: "return 前空行",
    plugin: "puck",
    pluginKey: "puck/newline-before-return",
    description: "Enforce exactly one blank line before `return` statements.",
    details:
      "要求在 return 语句前恰好有一行空行，避免代码拥挤或空行过多。直接作为无大括号控制语句主体的 return 被豁免。",
    type: "layout",
    fixable: "whitespace",
    messages: [
      { id: "expected", text: "Expected exactly one blank line before `return` statement." },
      { id: "unexpected", text: "Unexpected extra blank lines before `return` statement." },
    ],
    examples: [
      {
        title: "❌ return 前没有空行",
        valid: false,
        code: `function add(a: number, b: number) {
  const result = a + b;
  return result;
}`,
      },
      {
        title: "✅ return 前有一行空行",
        valid: true,
        code: `function add(a: number, b: number) {
  const result = a + b;

  return result;
}`,
      },
    ],
  },
  {
    id: "no-component-handlers",
    name: "no-component-handlers",
    title: "禁止组件内定义 handler",
    plugin: "puck",
    pluginKey: "puck/no-component-handlers",
    description: "Disallow component-local handle callbacks; handlers should be defined in stores.",
    details:
      "禁止在组件文件内部定义 `handle*` 回调函数。事件处理逻辑应该放在页面/组件的 store 中，通过 useStore 读取，使组件保持纯展示层。",
    type: "problem",
    scope: ".tsx 组件文件",
    ignores: [
      "/__spec__/",
      "/__tests__/",
      "/e2e/",
      "/routes/api/",
      "/_store/",
      "/store/",
      "*Store.tsx",
      "*Slice.tsx",
    ],
    messages: [
      {
        id: "componentHandler",
        text: "Do not define '{{name}}' in a component. Define it in the page/component store and read it through useStore.",
      },
    ],
    examples: [
      {
        title: "❌ 在组件里定义 handleClick",
        valid: false,
        code: `export const Button = () => {
  const handleClick = () => console.log("click");
  return <button onClick={handleClick}>Click</button>;
};`,
      },
      {
        title: "✅ 从 store 读取 handleClick",
        valid: true,
        code: `export const Button = () => {
  const { handleClick } = useButtonStore();
  return <button onClick={handleClick}>Click</button>;
};`,
      },
    ],
  },
  {
    id: "no-handle-return-function",
    name: "no-handle-return-function",
    title: "禁止 handle 返回函数",
    plugin: "puck",
    pluginKey: "puck/no-handle-return-function",
    description: "Disallow handle callbacks from returning another function.",
    details:
      "禁止 `handle*` 函数返回另一个函数。如需在 JSX 中传递参数，应使用 `handleXxx.bind(...)` 或把数据放在闭包外的变量里，而不是让 handler 返回闭包。",
    type: "problem",
    scope: ".ts / .tsx 文件",
    messages: [
      {
        id: "handleReturnFunction",
        text: "Do not return a function from '{{name}}'. Pass arguments with .bind in JSX instead.",
      },
    ],
    examples: [
      {
        title: "❌ handle 返回闭包",
        valid: false,
        code: `const handleItem = (id: string) => () => {
  deleteItem(id);
};

<button onClick={handleItem("1")}>Delete</button>;`,
      },
      {
        title: "✅ 使用 bind 传参",
        valid: true,
        code: `const handleItem = (id: string) => {
  deleteItem(id);
};

<button onClick={handleItem.bind(null, "1")}>Delete</button>;`,
      },
    ],
  },
  {
    id: "no-explicit-unknown",
    name: "no-explicit-unknown",
    title: "禁止显式 unknown",
    plugin: "puck",
    pluginKey: "puck/no-explicit-unknown",
    description: "Disallow explicit TypeScript `unknown` usage.",
    details:
      "禁止使用显式的 `unknown` 类型，要求使用由 schema 推导出的具体类型，减少动态类型带来的不确定性，让类型边界清晰。",
    type: "problem",
    messages: [
      {
        id: "noExplicitUnknown",
        text: "Unexpected `unknown` type. Use a concrete schema-derived type instead.",
      },
    ],
    examples: [
      {
        title: "❌ 使用 unknown",
        valid: false,
        code: `type Data = unknown;
const parse = (input: unknown) => input;`,
      },
      {
        title: "✅ 使用 schema 推导类型",
        valid: true,
        code: `type Data = z.infer<typeof UserSchema>;
const parse = (input: Data) => input;`,
      },
    ],
  },
  {
    id: "no-handle-calls-handle",
    name: "no-handle-calls-handle",
    title: "禁止 handle 调用 handle",
    plugin: "puck",
    pluginKey: "puck/no-handle-calls-handle",
    description: "Disallow handle callbacks from calling other handle callbacks.",
    details:
      "禁止在 `handle*` 函数内部调用另一个 `handle*` 函数。共享行为应抽到非 handle 前缀的 helper 中，避免事件处理函数相互耦合。",
    type: "problem",
    scope: ".tsx 组件文件",
    ignores: [
      "/__spec__/",
      "/__tests__/",
      "/e2e/",
      "/routes/api/",
      "/_store/",
      "/store/",
      "*Store.tsx",
      "*Slice.tsx",
    ],
    messages: [
      {
        id: "noHandleCall",
        text: "Do not call '{{name}}' inside a handle function. Move the shared behavior into a non-handle helper.",
      },
    ],
    examples: [
      {
        title: "❌ handleConfirm 调用 handleSave",
        valid: false,
        code: `const handleConfirm = () => {
  handleSave();
};`,
      },
      {
        title: "✅ 把行为下沉到普通 helper",
        valid: true,
        code: `const handleConfirm = () => {
  saveUser();
};`,
      },
    ],
  },
  {
    id: "no-handle-calls-on",
    name: "no-handle-calls-on",
    title: "禁止 handle 调用 on 回调",
    plugin: "puck",
    pluginKey: "puck/no-handle-calls-on",
    description: "Disallow handle callbacks from calling on callbacks.",
    details:
      "禁止在 `handle*` 函数内部调用 `on*` props 回调。props 传入的回调应直接透传，或包装在非 on 前缀的普通 helper 中。",
    type: "problem",
    scope: ".tsx 组件文件",
    ignores: [
      "/__spec__/",
      "/__tests__/",
      "/e2e/",
      "/routes/api/",
      "/_store/",
      "/store/",
      "*Store.tsx",
      "*Slice.tsx",
    ],
    messages: [
      {
        id: "noOnCall",
        text: "Do not call '{{name}}' inside a handle function. Pass props callbacks directly or wrap behavior in a non-on helper.",
      },
    ],
    examples: [
      {
        title: "❌ handleSubmit 调用 onSubmit",
        valid: false,
        code: `const handleSubmit = () => {
  onSubmit();
};`,
      },
      {
        title: "✅ 调用普通 helper",
        valid: true,
        code: `const handleSubmit = () => {
  submitForm();
};`,
      },
    ],
  },
  {
    id: "no-let",
    name: "no-let",
    title: "禁止 let 声明",
    plugin: "puck",
    pluginKey: "puck/no-let",
    description: "Disallow `let` declarations; use `const` instead.",
    details:
      "禁止使用 `let` 声明变量，统一使用 `const`，推动不可变数据风格，降低可变状态带来的副作用。",
    type: "problem",
    messages: [{ id: "noLet", text: "Unexpected `let` declaration. Use `const` instead." }],
    examples: [
      {
        title: "❌ 使用 let",
        valid: false,
        code: `let count = 0;
count = 1;`,
      },
      {
        title: "✅ 使用 const",
        valid: true,
        code: `const count = 0;`,
      },
    ],
  },
  {
    id: "no-process-env-outside-integration",
    name: "no-process-env-outside-integration",
    title: "禁止外部读取 process.env",
    plugin: "puck",
    pluginKey: "puck/no-process-env-outside-integration",
    description: "Disallow direct process.env usage outside env integration modules.",
    details:
      "禁止在环境集成模块之外直接读取 `process.env`。所有环境变量访问必须通过 `src/integrations/env/` 或 `src/integrations/server-env/` 的模块，便于集中校验、类型化和测试。",
    type: "problem",
    scope: "除 `src/integrations/env/` 与 `src/integrations/server-env/` 外的所有文件",
    messages: [
      {
        id: "noProcessEnv",
        text: "process.env must go through src/integrations/env or src/integrations/server-env instead of being read directly.",
      },
    ],
    examples: [
      {
        title: "❌ 在业务代码中直接读取",
        valid: false,
        code: `const apiUrl = process.env.API_URL;`,
      },
      {
        title: "✅ 通过集成模块暴露",
        valid: true,
        code: `// src/integrations/env/public.ts
export const apiUrl = process.env.API_URL;`,
      },
    ],
  },
  {
    id: "no-try",
    name: "no-try",
    title: "禁止 try 语句",
    plugin: "puck",
    pluginKey: "puck/no-try",
    description: "Disallow `try` statements. Use neverthrow for functional error handling instead.",
    details:
      "禁止使用 try/catch/finally，改用 neverthrow 的 Result、ok、err 进行函数式错误处理，让错误显式出现在类型签名中。",
    type: "problem",
    messages: [
      {
        id: "noTry",
        text: "Unexpected `try` statement. Use neverthrow (Result, ok, err) for functional error handling instead of try-catch.",
      },
    ],
    examples: [
      {
        title: "❌ try/catch",
        valid: false,
        code: `try {
  risky();
} catch (e) {
  logError(e);
}`,
      },
      {
        title: "✅ neverthrow Result",
        valid: true,
        code: `import { Result } from "neverthrow";
const result = Result.fromThrowable(risky)();`,
      },
    ],
  },
  {
    id: "no-use-effect",
    name: "no-use-effect",
    title: "禁止 effect hooks",
    plugin: "puck",
    pluginKey: "puck/no-use-effect",
    description: "Disallow useEffect and useLayoutEffect usage.",
    details:
      "禁止使用 React effect hooks（useEffect、useLayoutEffect 及符合 `use.*Effect` 命名模式的函数）。副作用应下沉到 store actions、事件处理器、路由 loader 或显式订阅中。",
    type: "problem",
    messages: [
      {
        id: "noUseEffect",
        text: "Do not use React effect hooks. Move the behavior to store actions, event handlers, route loaders, or explicit subscriptions.",
      },
    ],
    examples: [
      {
        title: "❌ 使用 useEffect 订阅",
        valid: false,
        code: `useEffect(() => {
  const unsubscribe = subscribe();
  return unsubscribe;
}, []);`,
      },
      {
        title: "✅ 通过 store action 初始化",
        valid: true,
        code: `const handleMount = () => {
  subscribe();
};

<button onClick={handleMount}>Start</button>;`,
      },
    ],
  },
  {
    id: "no-use-list-data-fallback",
    name: "no-use-list-data-fallback",
    title: "禁止 useList data 回退",
    plugin: "puck",
    pluginKey: "puck/no-use-list-data-fallback",
    description: "Disallow fallback arrays for Refine useList result data.",
    details:
      "禁止为 Refine `useList` 返回的 `result.data` 写 `?? []` 或可选链回退。`result.data` 始终为数组，直接使用即可，避免多余的类型收窄。",
    type: "problem",
    fixable: "code",
    messages: [
      {
        id: "noFallback",
        text: "useList result.data is always an array. Use result.data directly instead of optional chaining or `?? []`.",
      },
    ],
    examples: [
      {
        title: "❌ 给 data 加回退",
        valid: false,
        code: `const { data } = useList({ resource: "posts" });
return <PostList items={data ?? []} />;`,
      },
      {
        title: "✅ 直接使用 data",
        valid: true,
        code: `const { data } = useList({ resource: "posts" });
return <PostList items={data} />;`,
      },
    ],
  },
  {
    id: "strict-jsx-callback-handler",
    name: "strict-jsx-callback-handler",
    title: "JSX 回调必须是 handle",
    plugin: "puck",
    pluginKey: "puck/strict-jsx-callback-handler",
    description: "Require JSX on* callbacks to use handle* identifiers.",
    details:
      "要求 JSX `on*` 属性必须直接传递 `handle*` 标识符，或 `handle*.bind(...)`。唯一例外是 react-hook-form 的 `handleSubmit` 与 field 回调。避免内联箭头函数污染渲染。",
    type: "problem",
    scope: ".tsx 文件",
    ignores: ["/__spec__/", "/__tests__/", "/e2e/", "/routes/api/"],
    messages: [
      {
        id: "invalidCallback",
        text: "JSX '{{propName}}' callbacks must use handle* or handle*.bind(...). Form handleSubmit and field callbacks are the only exceptions.",
      },
    ],
    examples: [
      {
        title: "❌ 内联箭头函数",
        valid: false,
        code: `<button onClick={() => handleClick()}>Click</button>`,
      },
      {
        title: "✅ 直接传递 handle",
        valid: true,
        code: `<button onClick={handleClick}>Click</button>`,
      },
    ],
  },
  {
    id: "strict-jsx-handler-verb",
    name: "strict-jsx-handler-verb",
    title: "handle 名后缀匹配事件动词",
    plugin: "puck",
    pluginKey: "puck/strict-jsx-handler-verb",
    description: "Require JSX handler names to end with the exact event prop verb.",
    details:
      "要求 `handle*` 函数名的后缀必须与事件属性动词一致。例如 `onClick` 应传递 `handleClick`，`onSubmit` 应传递 `handleSubmit`，让事件与处理函数一一对应。",
    type: "problem",
    scope: ".tsx 文件",
    ignores: ["/__spec__/", "/__tests__/", "/e2e/", "/routes/api/"],
    messages: [
      {
        id: "mismatchedVerb",
        text: "'{{handlerName}}' passed to '{{propName}}' must end with '{{expectedSuffix}}'. Rename it to end with the exact event verb.",
      },
    ],
    examples: [
      {
        title: "❌ 动词不匹配",
        valid: false,
        code: `<Form onSubmit={handleClick} />`,
      },
      {
        title: "✅ 动词一致",
        valid: true,
        code: `<Form onSubmit={handleSubmit} />`,
      },
    ],
  },
  {
    id: "strict-method-module",
    name: "strict-method-module",
    title: "严格的方法/助手模块",
    plugin: "puck",
    pluginKey: "puck/strict-method-module",
    description:
      "Require method/helper modules to export one verb+noun method matching the file name.",
    details:
      "要求 `*.helper.ts` / `*.method.ts` 文件只导出一个与文件名同名的 `verb+Noun` 方法，且不能导出其它运行时值。方法名必须使用允许的动词前缀，保持业务动作文件的高度一致。",
    type: "problem",
    scope: "*.helper.ts / *.method.ts",
    messages: [
      {
        id: "extraRuntimeExport",
        text: "Method file '{{fileName}}' exports method '{{methodName}}' and another runtime value '{{exportName}}'. Keep one runtime method export per method file.",
      },
      {
        id: "invalidMethodName",
        text: "Method name '{{methodName}}' must be verb+noun lowerCamelCase, such as createUser or resolveRuntimeConfig.",
      },
      {
        id: "multipleMethodExports",
        text: "Method file '{{fileName}}' must export exactly one runtime method. Found {{count}} exported methods.",
      },
      {
        id: "mismatchedFileName",
        text: "Method file '{{fileName}}' must match exported method '{{methodName}}'. Rename the file to '{{methodName}}.{{suffix}}'.",
      },
    ],
    examples: [
      {
        title: "❌ 导出两个方法",
        valid: false,
        code: `// createUser.method.ts
export const createUser = () => {};
export const updateUser = () => {};`,
      },
      {
        title: "✅ 只导出一个同名方法",
        valid: true,
        code: `// createUser.method.ts
export const createUser = (input: CreateUserInput) => {
  return db.insert(input);
};`,
      },
    ],
  },
] satisfies RuleInfo[];

export const getRuleById = (id: string): RuleInfo | undefined =>
  rules.find((rule) => rule.id === id);
