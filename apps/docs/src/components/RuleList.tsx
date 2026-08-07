import { Link } from "@tanstack/react-router";
import { rules } from "@/lib/rules";
import { AlertTriangle, Check, Wrench, ChevronRight } from "lucide-react";

export const RuleList = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-card text-left">
          <tr>
            <th className="px-4 py-3 font-medium text-foreground">规则</th>
            <th className="px-4 py-3 font-medium text-foreground">类型</th>
            <th className="px-4 py-3 font-medium text-foreground">自动修复</th>
            <th className="px-4 py-3 font-medium text-foreground">说明</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr
              key={rule.id}
              className="border-b border-border transition-colors last:border-b-0 hover:bg-secondary/30"
            >
              <td className="px-4 py-3 align-top">
                <Link
                  className="group flex items-center gap-1 font-mono text-primary"
                  params={{ ruleId: rule.id }}
                  to="/docs/rules/$ruleId"
                >
                  {rule.name}
                  <ChevronRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </td>
              <td className="px-4 py-3 align-top">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <AlertTriangle className="size-3" />
                  {rule.type}
                </span>
              </td>
              <td className="px-4 py-3 align-top">
                {rule.fixable ? (
                  <span className="inline-flex items-center gap-1.5 text-primary">
                    <Wrench className="size-3" />
                    {rule.fixable}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground/60">
                    <Check className="size-3" />否
                  </span>
                )}
              </td>
              <td className="px-4 py-3 align-top text-muted-foreground">{rule.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
