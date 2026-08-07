import { createFileRoute, Link } from "@tanstack/react-router";
import { DocPage } from "@/components/DocPage";
import { rules } from "@/lib/rules";

const GettingStartedPage = () => {
  return (
    <DocPage
      title="快速开始"
      description="在项目中启用 Puck 自定义 Oxlint 规则。"
      prev={{ title: "介绍", to: "/docs" }}
    >
      <p>
        Puck 规则以 Oxlint JS 插件形式分发。你可以直接引用 <code>packages/rules/src/plugins</code>{" "}
        下的 TypeScript 源文件（需要 Node ≥22.18 的原生 type-stripping）， 或引用编译后的{" "}
        <code>dist/plugins/*.js</code> 产物。
      </p>

      <h2>1. 安装 Oxlint</h2>
      <pre>
        <code>{`bun add -D oxlint`}</code>
      </pre>

      <h2>2. 配置 .oxlintrc.json</h2>
      <p>
        将需要的插件注册到 <code>jsPlugins</code>，并在 <code>rules</code> 中开启对应规则：
      </p>
      <pre>
        <code>{`{
  "jsPlugins": [
    "./node_modules/@repo/rules/dist/plugins/no-let/no-let.js",
    "./node_modules/@repo/rules/dist/plugins/strict-method-module/strict-method-module.js"
  ],
  "rules": {
    "template-vars/no-let": "error",
    "template-method/strict-method-module": "error"
  }
}`}</code>
      </pre>

      <h2>3. 运行检查</h2>
      <pre>
        <code>{`bunx oxlint --config .oxlintrc.json src/`}</code>
      </pre>

      <h2>规则速览</h2>
      <p>当前共 {rules.length} 条规则，可通过左侧导航或规则清单查看：</p>
      <ul>
        {rules.map((rule) => (
          <li key={rule.id}>
            <Link params={{ ruleId: rule.id }} to="/docs/rules/$ruleId">
              {rule.name}
            </Link>{" "}
            — {rule.title}
          </li>
        ))}
      </ul>
    </DocPage>
  );
};

export const Route = createFileRoute("/docs/getting-started")({
  component: GettingStartedPage,
});
