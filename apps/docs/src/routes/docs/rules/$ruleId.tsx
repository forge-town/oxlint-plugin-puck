import { createFileRoute } from "@tanstack/react-router";
import { RulePage } from "@/components/RulePage";
import { getRuleById, rules } from "@/lib/rules";

const RuleRoute = () => {
  const { ruleId } = Route.useParams();
  const rule = getRuleById(ruleId);
  const index = rules.findIndex((item) => item.id === ruleId);
  const prev = index > 0 ? rules[index - 1] : undefined;
  const next = index >= 0 && index < rules.length - 1 ? rules[index + 1] : undefined;

  if (!rule) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">规则未找到</h1>
        <p className="text-muted-foreground">
          没有找到名为 <code>{ruleId}</code> 的规则。请从左侧导航选择一条规则。
        </p>
      </div>
    );
  }

  return <RulePage rule={rule} prev={prev} next={next} />;
};

export const Route = createFileRoute("/docs/rules/$ruleId")({
  component: RuleRoute,
});
