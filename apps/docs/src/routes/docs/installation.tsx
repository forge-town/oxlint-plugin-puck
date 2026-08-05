import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/DocPage";

const InstallationPage = () => {
  return (
    <DocPage
      title="安装"
      description="在 monorepo 中安装本项目所需的依赖。"
      prev={{ title: "快速开始", to: "/docs/getting-started" }}
      next={{ title: "目录结构", to: "/docs/guides/structure" }}
    >
      <p>在工作区根目录执行：</p>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4">
        <code>{"bun install"}</code>
      </pre>
      <p>
        依赖来自 monorepo 工作区，共享包（如 <code>@repo/ui</code>）无需单独安装。
      </p>
    </DocPage>
  );
};

export const Route = createFileRoute("/docs/installation")({
  component: InstallationPage,
});
