import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/DocPage";

const CliPage = () => {
  return (
    <DocPage
      title="CLI"
      description="常用命令速查表。"
      prev={{ title: "API", to: "/docs/reference/api" }}
    >
      <pre className="overflow-x-auto rounded-lg bg-muted p-4">
        <code>{`bun run dev          # 启动开发服务器
bun run build        # 生产构建
bun run test         # 运行测试
bun run lint         # 代码检查
bun run quality      # lint + type + test`}</code>
      </pre>
      <p>
        在 monorepo 根目录可用 <code>--filter</code> 仅操作本项目：
      </p>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4">
        <code>{"bun run dev --filter=@repo/docs"}</code>
      </pre>
    </DocPage>
  );
};

export const Route = createFileRoute("/docs/reference/cli")({
  component: CliPage,
});
