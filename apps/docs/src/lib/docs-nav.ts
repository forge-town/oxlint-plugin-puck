import { rules } from "./rules.ts";

export type DocNavItem = {
  title: string;
  to: string;
};

export type DocNavSection = {
  title: string;
  items: DocNavItem[];
};

export const docNav: DocNavSection[] = [
  {
    title: "开始",
    items: [
      { title: "介绍", to: "/docs" },
      { title: "快速开始", to: "/docs/getting-started" },
    ],
  },
  {
    title: "规则",
    items: rules.map((rule) => ({
      title: rule.name,
      to: `/docs/rules/${rule.id}`,
    })),
  },
];
