import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/DocPage";

const StylingPage = () => {
  return (
    <DocPage
      title="样式"
      description="使用 Tailwind CSS v4 与共享主题变量。"
      prev={{ title: "路由", to: "/docs/guides/routing" }}
      next={{ title: "API", to: "/docs/reference/api" }}
    >
      <p>
        样式基于 Tailwind CSS v4 构建，主题变量定义在 <code>src/styles.css</code> 中， 与{" "}
        <code>@repo/ui</code> 共享同一套设计令牌。
      </p>
      <h2>深色模式</h2>
      <p>
        在 <code>html</code> 元素上添加 <code>dark</code> class 即可切换深色模式。
      </p>
      <h2>使用共享组件</h2>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4">
        <code>{`import { Button } from "@repo/ui/button";`}</code>
      </pre>
    </DocPage>
  );
};

export const Route = createFileRoute("/docs/guides/styling")({
  component: StylingPage,
});
