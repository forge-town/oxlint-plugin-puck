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
        Puck 规则通过 Forge Town 的私有 GitHub Package 分发。安装一个插件包后，即可通过统一的{" "}
        <code>puck/*</code> 命名空间使用全部规则。
      </p>

      <h2>1. 配置 Forge Town registry</h2>
      <pre>
        <code>{`# .npmrc
@forge-town:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}`}</code>
      </pre>

      <h2>2. 安装 Oxlint 与 Puck</h2>
      <pre>
        <code>{`bun add -D oxlint @forge-town/oxlint-plugin-puck`}</code>
      </pre>

      <h2>3. 配置 .oxlintrc.json</h2>
      <p>
        注册一次 Puck plugin，并在 <code>rules</code> 中开启需要的规则：
      </p>
      <pre>
        <code>{`{
  "jsPlugins": [
    {
      "name": "puck",
      "specifier": "@forge-town/oxlint-plugin-puck"
    }
  ],
  "rules": {
    "puck/no-let": "error",
    "puck/strict-method-module": "error"
  }
}`}</code>
      </pre>

      <h2>4. 运行检查</h2>
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
