import { BookOpen } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center rounded-lg bg-primary/10 p-2">
        <BookOpen className="size-5 text-primary" />
        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
      </div>
      <span className="text-lg font-bold tracking-tight text-foreground">Docs</span>
    </div>
  );
};
