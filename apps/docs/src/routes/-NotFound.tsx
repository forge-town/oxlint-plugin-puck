import { Link } from "@tanstack/react-router";
import { Button } from "@repo/ui/button";

export const NotFound = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-6">
      <div className="relative text-8xl font-bold tracking-tighter text-foreground">
        404
        <span className="absolute inset-0 animate-pulse text-primary opacity-20 blur-md">404</span>
      </div>
      <p className="text-muted-foreground">页面未找到</p>
      <Button render={<Link to="/" />}>返回首页</Button>
    </div>
  );
};
