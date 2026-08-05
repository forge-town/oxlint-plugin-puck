import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Code2, Compass, FileText } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";

const features = [
  {
    title: "快速开始",
    description: "几分钟内搭建你的第一个文档站点",
    to: "/docs/getting-started",
    icon: Compass,
  },
  {
    title: "指南",
    description: "深入理解目录结构、路由与样式方案",
    to: "/docs/guides/structure",
    icon: BookOpen,
  },
  {
    title: "API 参考",
    description: "完整的 API 与 CLI 使用说明",
    to: "/docs/reference/api",
    icon: FileText,
  },
];

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 px-6 py-20">
      <section className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm text-muted-foreground">
          <Code2 className="size-4" />
          Technical Documentation
        </span>
        <h1 className="text-5xl font-bold tracking-tight">Docs</h1>
        <p className="text-lg text-muted-foreground">
          一个基于 TanStack Start 的技术文档项目模板，内置导航、侧边栏与完整的示例页面。
        </p>
        <div className="flex items-center gap-3">
          <Button render={<Link to="/docs" />}>开始阅读</Button>
          <Button variant="secondary" render={<Link to="/docs/guides/structure" />}>
            项目结构
          </Button>
        </div>
      </section>

      <section className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.title} to={feature.to}>
            <Card className="h-full transition-colors hover:bg-accent/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <feature.icon className="size-4" />
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">前往阅读 →</CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: HomePage,
});
