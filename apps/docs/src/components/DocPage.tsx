import { Link } from "@tanstack/react-router";
import type { ComponentProps, JSX, ReactNode } from "react";
import { Prose } from "./Prose";

type DocPageProps = {
  title: string;
  description?: string;
  children: ReactNode;
  prev?: { title: string; to: ComponentProps<typeof Link>["to"] };
  next?: { title: string; to: ComponentProps<typeof Link>["to"] };
};

export const DocPage = ({
  title,
  description,
  children,
  prev,
  next,
}: DocPageProps): JSX.Element => {
  return (
    <article className="fade-in mx-auto flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="text-lg text-muted-foreground">{description}</p> : null}
        <div className="mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-accent" />
      </header>
      <Prose>{children}</Prose>
      {prev || next ? (
        <nav className="mt-4 flex items-center justify-between border-t border-border pt-6">
          {prev ? (
            <Link className="group flex flex-col gap-1" to={prev.to}>
              <span className="text-xs text-muted-foreground">上一篇</span>
              <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                ← {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link className="group flex flex-col items-end gap-1 text-right" to={next.to}>
              <span className="text-xs text-muted-foreground">下一篇</span>
              <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                {next.title} →
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </article>
  );
};
