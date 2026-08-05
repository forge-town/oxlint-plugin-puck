import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/DocPage";

const RoutingPage = () => {
  return (
    <DocPage
      title="路由"
      description="基于文件的路由系统与导航配置。"
      prev={{ title: "目录结构", to: "/docs/guides/structure" }}
      next={{ title: "样式", to: "/docs/guides/styling" }}
    >
      <p>
        本项目使用 TanStack Router 的文件路由。每个 <code>.tsx</code> 文件对应一个路由， 路由树由{" "}
        <code>routeTree.gen.ts</code> 自动生成。
      </p>
      <h2>导航配置</h2>
      <p>
        侧边栏导航在 <code>src/lib/docs-nav.ts</code> 中定义，按章节组织文档链接。
      </p>
      <h2>页面间跳转</h2>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4">
        <code>{`<Link to="/docs/getting-started">快速开始</Link>`}</code>
      </pre>
    </DocPage>
  );
};

export const Route = createFileRoute("/docs/guides/routing")({
  component: RoutingPage,
});
