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
    title: "入门",
    items: [
      { title: "介绍", to: "/docs" },
      { title: "快速开始", to: "/docs/getting-started" },
      { title: "安装", to: "/docs/installation" },
    ],
  },
  {
    title: "指南",
    items: [
      { title: "目录结构", to: "/docs/guides/structure" },
      { title: "路由", to: "/docs/guides/routing" },
      { title: "样式", to: "/docs/guides/styling" },
    ],
  },
  {
    title: "参考",
    items: [
      { title: "API", to: "/docs/reference/api" },
      { title: "CLI", to: "/docs/reference/cli" },
    ],
  },
];
