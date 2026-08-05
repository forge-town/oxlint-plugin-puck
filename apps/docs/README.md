# Docs

基于 TanStack Start 的技术文档项目。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | TanStack Start (Vite + Nitro) |
| 路由 | TanStack Router (文件路由) |
| UI | @repo/ui + Tailwind CSS v4 |
| 测试 | Vitest + Testing Library |
| Lint | OxLint |
| 格式化 | OxFmt |

## 开发

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 运行测试
bun run test

# 类型检查 + lint + 格式化检查 + 测试
bun run quality
```

## 目录结构

```
src/
├── components/       # 文档布局与通用组件
│   ├── DocsLayout.tsx    # 侧边栏 + 内容区布局
│   ├── DocsSidebar.tsx   # 侧边栏导航
│   └── DocPage.tsx       # 文档页面外壳
├── lib/              # 工具函数
│   └── docs-nav.ts   # 文档导航配置
├── routes/           # TanStack Router 文件路由
│   ├── index.tsx     # 首页
│   └── docs/         # 文档页面
└── styles.css        # Tailwind CSS 主题
```

## 新增文档页面

1. 在 `src/routes/docs/` 下创建路由文件，例如 `src/routes/docs/guides/foo.tsx`
2. 使用 `DocPage` 组件组织页面结构
3. 在 `src/lib/docs-nav.ts` 中登记导航项
