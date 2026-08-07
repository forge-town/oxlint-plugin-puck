import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/DocPage";
import { RuleList } from "@/components/RuleList";
import { rules } from "@/lib/rules";

const DocsIndexPage = () => {
  return (
    <DocPage
      title="Oxlint Plugin Puck"
      description="为 monorepo 前端项目设计的自定义 Oxlint 规则集。"
      next={{ title: "快速开始", to: "/docs/getting-started" }}
    >
      <p>
        Puck 是一套与项目架构强绑定的 Oxlint 自定义规则，覆盖组件、schema、store、
        method/helper、JSX 事件处理等关键约束。它不是为了替代通用规则， 而是把项目约定编码进
        lint，让代码结构在 review 之前就被自动保护。
      </p>
      <h2>包含哪些规则？</h2>
      <p>
        当前包含 {rules.length} 条规则，按插件分组。点击规则名称查看详细说明、
        可配置项、作用范围与代码示例。
      </p>
      <RuleList />
      <h2>为什么自定义规则？</h2>
      <ul>
        <li>把项目约定从 README 迁移到自动检查，减少口头约束。</li>
        <li>在 CI 中统一执行，避免不同成员理解不一致。</li>
        <li>与 Oxlint 的高速解析结合，lint 成本低，反馈快。</li>
      </ul>
    </DocPage>
  );
};

export const Route = createFileRoute("/docs/")({
  component: DocsIndexPage,
});
