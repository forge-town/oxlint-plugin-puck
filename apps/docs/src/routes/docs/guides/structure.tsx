import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/DocPage";

const StructurePage = () => {
  return (
    <DocPage
      title="目录结构"
      description="了解文档项目的核心目录布局。"
      prev={{ title: "安装", to: "/docs/installation" }}
      next={{ title: "路由", to: "/docs/guides/routing" }}
    >
      <p>项目的核心结构如下：</p>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4">
        <code>{`src/
├── components/     # 文档布局与通用组件
├── lib/            # 导航配置等工具
└── routes/         # 文件路由（TanStack Router）
    ├── index.tsx   # 首页
    └── docs/       # 文档页面`}</code>
      </pre>
      <p>
        新增文档页面时，在 <code>src/routes/docs/</code> 下创建文件即可自动生成路由。
      </p>
    </DocPage>
  );
};

export const Route = createFileRoute("/docs/guides/structure")({
  component: StructurePage,
});
