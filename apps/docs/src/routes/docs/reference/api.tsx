import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/DocPage";

const ApiPage = () => {
  return (
    <DocPage
      title="API 参考"
      description="共享组件与工具函数的使用说明。"
      prev={{ title: "样式", to: "/docs/guides/styling" }}
      next={{ title: "CLI", to: "/docs/reference/cli" }}
    >
      <h2>共享组件库</h2>
      <p>
        文档项目复用 <code>@repo/ui</code> 中的组件，按子路径导入：
      </p>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4">
        <code>{`import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { SidebarProvider } from "@repo/ui/sidebar";`}</code>
      </pre>
      <h2>工具函数</h2>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4">
        <code>{`import { cn } from "@repo/ui/lib/utils";`}</code>
      </pre>
    </DocPage>
  );
};

export const Route = createFileRoute("/docs/reference/api")({
  component: ApiPage,
});
