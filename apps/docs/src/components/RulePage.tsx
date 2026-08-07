import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { RuleInfo } from "@/lib/rules";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  FileCode,
  LinkIcon,
  Wrench,
  X,
} from "lucide-react";
import { RuleToc, type TocItem } from "./RuleToc";

type RulePageProps = {
  rule: RuleInfo;
  prev?: RuleInfo;
  next?: RuleInfo;
};

const SectionHeading = ({ id, children }: { id: string; children: ReactNode }) => {
  return (
    <h2
      id={id}
      className="group mt-10 scroll-mt-20 border-b border-border pb-2 text-2xl font-semibold tracking-tight text-foreground first:mt-0"
    >
      <a className="anchor-link inline-flex items-center gap-2 no-underline" href={`#${id}`}>
        {children}
        <LinkIcon className="size-4 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/60" />
      </a>
    </h2>
  );
};

const OptionHeading = ({ id, children }: { id: string; children: ReactNode }) => {
  return (
    <h3
      id={id}
      className="group mt-8 scroll-mt-20 text-xl font-semibold tracking-tight text-foreground"
    >
      <a className="anchor-link inline-flex items-center gap-2 no-underline" href={`#${id}`}>
        {children}
        <LinkIcon className="size-4 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/60" />
      </a>
    </h3>
  );
};

const CodeBlock = ({
  label,
  code,
  variant,
}: {
  label: string;
  code: string;
  variant: "incorrect" | "correct";
}) => {
  const icon = variant === "incorrect" ? X : Check;
  const Icon = icon;

  return (
    <div
      className={`my-4 overflow-hidden rounded-xl border border-border border-l-4 bg-card ${variant === "incorrect" ? "border-l-red-500" : "border-l-green-500"}`}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Icon
            className={`size-3 ${variant === "incorrect" ? "text-red-500" : "text-green-500"}`}
          />
          {label}
        </span>
        <span className="text-xs font-mono text-muted-foreground/60">{`ts`}</span>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const InlineBadge = ({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning";
}) => {
  const variants = {
    default: "border-border bg-card text-muted-foreground",
    success: "border-green-500/30 bg-green-500/10 text-green-500",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

export const RulePage = ({ rule, prev, next }: RulePageProps) => {
  const tocItems: TocItem[] = [
    { id: "what-it-does", title: "What it does" },
    { id: "why-is-this-bad", title: "Why is this bad?" },
    { id: "examples", title: "Examples" },
    ...(rule.options && rule.options.length > 0
      ? [
          {
            id: "configuration",
            title: "Configuration",
            items: rule.options.map((option) => ({
              id: `option-${option.name}`,
              title: option.name,
            })),
          },
        ]
      : []),
    { id: "how-to-use", title: "How to use" },
    { id: "references", title: "References" },
  ];

  return (
    <div className="relative mx-auto flex max-w-7xl gap-12">
      <article className="min-w-0 flex-1 max-w-3xl">
        <Link
          className="group mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          to="/docs"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Back to rules
        </Link>

        <header className="mb-8">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">{rule.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <InlineBadge>
              <FileCode className="size-3" />
              {rule.pluginKey}
            </InlineBadge>
            <InlineBadge variant={rule.type === "problem" ? "warning" : "default"}>
              {rule.type}
            </InlineBadge>
            {rule.fixable ? (
              <InlineBadge variant="success">
                <Wrench className="size-3" />
                auto-fix ({rule.fixable})
              </InlineBadge>
            ) : null}
          </div>
        </header>

        <div className="prose-docs">
          <SectionHeading id="what-it-does">What it does</SectionHeading>
          <p className="text-muted-foreground">{rule.description}</p>

          <SectionHeading id="why-is-this-bad">Why is this bad?</SectionHeading>
          <p className="text-muted-foreground">{rule.details}</p>

          {rule.scope ? (
            <div className="my-4 rounded-lg border border-border bg-card p-4">
              <h3 className="mb-1 text-sm font-medium text-foreground">Scope</h3>
              <p className="text-sm text-muted-foreground">{rule.scope}</p>
            </div>
          ) : null}

          {rule.ignores && rule.ignores.length > 0 ? (
            <div className="my-4 rounded-lg border border-border bg-card p-4">
              <h3 className="mb-1 text-sm font-medium text-foreground">Ignored paths</h3>
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                {rule.ignores.map((ignore) => (
                  <li key={ignore}>
                    <code>{ignore}</code>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <SectionHeading id="examples">Examples</SectionHeading>
          {rule.examples.map((example) => (
            <CodeBlock
              key={example.title}
              label={example.valid ? "Correct" : "Incorrect"}
              code={example.code}
              variant={example.valid ? "correct" : "incorrect"}
            />
          ))}

          {rule.options && rule.options.length > 0 ? (
            <>
              <SectionHeading id="configuration">Configuration</SectionHeading>
              <p className="text-muted-foreground">This rule accepts the following options:</p>
              {rule.options.map((option) => (
                <div key={option.name}>
                  <OptionHeading id={`option-${option.name}`}>{option.name}</OptionHeading>
                  <div className="my-3 flex flex-wrap gap-2">
                    <InlineBadge>type: {option.type}</InlineBadge>
                    {option.default ? <InlineBadge>default: {option.default}</InlineBadge> : null}
                  </div>
                  <p className="text-muted-foreground">{option.description}</p>
                </div>
              ))}
            </>
          ) : null}

          <SectionHeading id="how-to-use">How to use</SectionHeading>
          <p className="text-muted-foreground">
            Add the plugin and enable the rule in your <code>.oxlintrc.json</code>:
          </p>
          <div className="my-4 overflow-hidden rounded-xl border border-border border-l-primary bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2">
              <span className="text-xs font-mono text-muted-foreground/60">json</span>
            </div>
            <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
              <code>{`{
  "jsPlugins": [
    {
      "name": "puck",
      "specifier": "@forge-town/oxlint-plugin-puck"
    }
  ],
  "rules": {
    "${rule.pluginKey}": "error"
  }
}`}</code>
            </pre>
          </div>

          <SectionHeading id="references">References</SectionHeading>
          <ul className="flex flex-col gap-2 text-muted-foreground">
            <li>
              <a
                className="inline-flex items-center gap-1 text-primary hover:underline"
                href={`https://github.com/forge-town/oxlint-plugin-puck/tree/main/packages/rules/src/plugins/${rule.id}/${rule.id}.ts`}
                rel="noreferrer"
                target="_blank"
              >
                Rule source
                <ExternalLink className="size-3" />
              </a>
            </li>
            <li>
              <span className="text-sm">Plugin:</span>{" "}
              <code className="text-primary">{rule.plugin}</code>
            </li>
          </ul>
        </div>

        <nav className="mt-12 flex items-center justify-between border-t border-border pt-6">
          {prev ? (
            <Link
              className="group flex flex-col gap-1"
              params={{ ruleId: prev.id }}
              to="/docs/rules/$ruleId"
            >
              <span className="text-xs text-muted-foreground">Previous rule</span>
              <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                <ArrowLeft className="inline size-3" />
                {prev.name}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              className="group flex flex-col items-end gap-1 text-right"
              params={{ ruleId: next.id }}
              to="/docs/rules/$ruleId"
            >
              <span className="text-xs text-muted-foreground">Next rule</span>
              <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                {next.name}
                <ArrowRight className="inline size-3" />
              </span>
            </Link>
          ) : null}
        </nav>
      </article>

      <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-64 shrink-0 overflow-y-auto xl:block">
        <RuleToc items={tocItems} />
      </aside>
    </div>
  );
};
