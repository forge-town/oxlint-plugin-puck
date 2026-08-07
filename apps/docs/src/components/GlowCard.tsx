import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

type GlowCardProps = {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  className?: string;
};

export const GlowCard = ({ title, description, to, icon: Icon, className }: GlowCardProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_15%,transparent)]",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <span className="mt-auto text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
        前往阅读 →
      </span>
    </Link>
  );
};
