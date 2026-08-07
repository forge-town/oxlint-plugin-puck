import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { Button } from "@repo/ui/button";

export const HomeHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link className="flex items-center gap-2" to="/">
          <div className="relative flex items-center justify-center rounded-lg bg-primary/10 p-2">
            <Shield className="size-5 text-primary" />
            <span className="absolute -right-1 -top-1 size-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">Puck Docs</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            to="/docs"
          >
            Docs
          </Link>
          <a
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            href="https://github.com/repo/oxlint-plugin-puck"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <Button render={<Link to="/docs/getting-started" />} size="sm">
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
};
