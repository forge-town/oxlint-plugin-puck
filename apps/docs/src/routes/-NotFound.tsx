import { Link } from "@tanstack/react-router";

export const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">页面未找到</p>
      <Link className="text-primary underline" to="/">
        返回首页
      </Link>
    </div>
  );
};
