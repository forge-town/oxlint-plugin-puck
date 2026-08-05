import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/DocPage";

const GettingStartedPage = () => {
  return (
    <DocPage
      title="快速开始"
      description="几分钟内启动本地开发环境。"
      prev={{ title: "介绍", to: "/docs" }}
      next={{ title: "安装", to: "/docs/installation" }}
    >
      <p>克隆项目并安装依赖：</p>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4">
        <code>{"bun install\nbun run dev"}</code>
      </pre>
      <p>
        开发服务器默认运行在 <code>http://localhost:3001</code>。
      </p>
    </DocPage>
  );
};

export const Route = createFileRoute("/docs/getting-started")({
  component: GettingStartedPage,
});
