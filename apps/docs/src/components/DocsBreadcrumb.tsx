import { useLocation } from "@tanstack/react-router";
import { docNav } from "@/lib/docs-nav";
import { getRuleById } from "@/lib/rules";

const RULES_PREFIX = "/docs/rules/";

export const DocsBreadcrumb = () => {
  const { pathname } = useLocation();

  if (pathname.startsWith(RULES_PREFIX)) {
    const ruleId = pathname.slice(RULES_PREFIX.length);
    const rule = getRuleById(ruleId);

    if (rule) {
      return (
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">Docs</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">规则</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-foreground">{rule.name}</span>
        </div>
      );
    }
  }

  for (const section of docNav) {
    const item = section.items.find((navItem) => navItem.to === pathname);
    if (item) {
      return (
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">Docs</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{section.title}</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium text-foreground">{item.title}</span>
        </div>
      );
    }
  }

  return <span className="text-sm font-medium text-foreground">Docs</span>;
};
