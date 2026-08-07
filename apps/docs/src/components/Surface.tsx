import type { ReactNode } from "react";

export const Surface = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-svh bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.35]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_bottom,transparent_50%,var(--scan-line)_50%)] bg-[size:100%_3px] opacity-[0.06]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_85%)]" />
      {children}
    </div>
  );
};
