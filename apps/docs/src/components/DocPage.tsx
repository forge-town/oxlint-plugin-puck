import { Link } from "@tanstack/react-router";
import type { JSX } from "react";

type DocPageProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  prev?: { title: string; to: string };
  next?: { title: string; to: string };
};

export const DocPage = ({
  title,
  description,
  children,
  prev,
  next,
}: DocPageProps): JSX.Element => {
  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description ? <p className="text-muted-foreground">{description}</p> : null}
      </header>
      <div className="flex flex-col gap-4 text-pretty leading-relaxed">{children}</div>
      <nav className="mt-4 flex items-center justify-between border-t pt-4">
        {prev ? (
          <Link className="text-sm text-muted-foreground hover:text-foreground" to={prev.to}>
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="text-sm font-medium hover:text-foreground" to={next.to}>
            {next.title} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
};
