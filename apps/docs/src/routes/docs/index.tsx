import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/DocPage";

const IntroPage = () => {
  return (
    <DocPage
      title="介绍"
      description="这是一个基于 TanStack Start 的技术文档项目。"
      next={{ title: "快速开始", to: "/docs/getting-started" }}
    >
      <p>
        本项目使用 TanStack Start 构建，提供文件路由、服务端渲染与现代化的 React
        开发体验。左侧导航按章节组织文档内容。
      </p>
      <h2>特性</h2>
      <ul>
        <li>基于文件的路由系统，自动生成路由树</li>
        <li>内置侧边栏导航与文档布局</li>
        <li>支持深色模式与响应式设计</li>
        <li>与 monorepo 中共享组件库无缝集成</li>
      </ul>
    </DocPage>
  );
};

export const Route = createFileRoute("/docs/")({
  component: IntroPage,
});
