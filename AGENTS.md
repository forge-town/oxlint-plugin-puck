# monorepo-template-bun

基于 Bun + Turborepo 的 monorepo 项目模板，内置多个可直接使用的应用模板，通过 CLI 工具一键拆分生成新项目。

## 项目结构

```
monorepo-template-bun/
├── apps/                          # 应用模板
│   ├── docs/                      # TanStack Start 技术文档项目
│   ├── core/                      # Oxlint plugin 的薄分发与发布层
│   ├── payloadcms-website-template/    # Next.js + Payload CMS 内容管理网站
│   └── tauri-app-template/        # Tauri + Vite 跨平台桌面应用
├── packages/                      # 共享包
│   ├── ui/                        # React 组件库（@repo/ui），基于 @base-ui/react
│   ├── logger/                    # Pino 日志工具（@repo/logger）
│   ├── schemas/                   # Zod schema 定义（@repo/schemas）
│   ├── shared/                    # 通用工具函数（@repo/shared）
│   ├── typescript-config/         # 共享 TS 配置（base/nextjs/react-library）
│   ├── rules/                     # Oxlint 规则实现、测试与内部 registry
│   ├── oxlint-config/             # 共享 Oxlint 配置（消费 apps/core）
│   └── oxc-formatter-config/      # 共享 Oxc 格式化配置
├── scripts/
│   └── create-monorepo-app/       # 项目创建 CLI（Node.js 20+，ESM）
├── .agents/skills/                # Claude Code Skills（最佳实践规范）
├── .github/instructions/          # GitHub Copilot 指令
├── .github/prompts/               # 本地 prompt 模板
├── turbo.json                     # Turborepo 任务配置
├── knip.json                      # 无用代码检测配置
└── package.json                   # 工作区根配置
```

## 技术栈

| 层级 | 工具 | 版本/说明 |
|------|------|----------|
| 包管理器 | Bun | 1.3.11+ |
| 任务编排 | Turborepo | 缓存、并行构建 |
| 类型系统 | TypeScript | 5.9，严格模式 |
| 代码检查 | Oxlint | 替代 ESLint，自定义插件 |
| 格式化 | Prettier + Oxc | |
| 包发布 | Changesets | 版本管理与发布 |
| 无用代码检测 | Knip | |

### 各应用技术栈

**docs**
- 框架：TanStack Start + Vite + Nitro
- 内容：技术文档，文件路由组织页面
- UI：Tailwind CSS v4 + @repo/ui 组件
- 测试：Vitest + Testing Library

**payloadcms-website-template**
- 框架：Next.js 16 + Payload CMS 3.84
- 数据库：PostgreSQL（@payloadcms/db-postgres）
- UI：Tailwind CSS v4 + Radix UI + Geist 字体
- 测试：Vitest + Playwright

**tauri-app-template**
- 框架：Tauri v2 + Vite
- UI：React 19（最简配置，无 UI 库）

## 开发规范

### 代码规范（Oxlint 规则）

- **禁止 `any`**：`no-explicit-any: error`
- **类型导入**：`typescript/consistent-type-imports: error`
- **禁止 `var`**，优先 `const`
- **函数风格**：优先箭头函数表达式
- **JSX 属性排序**：callbacksLast, shorthandFirst, ignoreCase, reservedFirst
- **事件处理器命名**：`handle` 前缀（本地变量），`on` 前缀（props）
- **Unicorn 规则**：catch-error-name, explicit-length-check, no-await-expression-member 等

### 开发范式

1. **后端优先**：先实现 API/Service/DAO → 测试后端 → 再写前端 → 测试前端
2. **TDD**：Red（写失败测试）→ Green（写最少代码通过）→ Refactor（重构）
3. **Skill-First**：执行任务前先检索可用的 Skills，按规范执行

### 关键架构约束

- **tRPC**：组件层禁止直接调用 tRPC，必须通过 Refine hooks（`useList`/`useOne`/`useCreate`/`useUpdate`）
- **表单**：react-hook-form 独立管理状态，禁止与 zustand 直接绑定，提交时通过副本输出
- **Zustand Store**：使用 slice 模式 + React Context Provider（非全局单例），数据优先从 store 获取
- **DAO 写操作**：涉及多表时必须创建 Repository 层
- **禁止非 index 文件 re-export**：消费文件直接从来源 import
- **一文件一组件**：禁止多组件共存
- **禁止内联 SVG**：提取为独立 Icon 组件

### 页面结构规范（Anatomy）

页面按复杂度分为：
- **简单页面**：Content 组件 + index.ts 导出
- **复杂页面**：Wrapper（布局）+ Content（业务）+ 可选 Store（状态）

## 常用命令

```bash
# 根目录命令
bun run dev              # 开发所有应用
bun run build            # 构建所有应用和包
bun run test             # 运行所有测试
bun run lint             # 代码检查
bun run check-types      # 类型检查
bun run quality          # lint + type + test
bun run format           # 格式化代码
bun run knip             # 检测无用依赖/导出
bun run changeset        # 添加 changeset
bun run version-packages # 更新版本
bun run release          # 发布

# 单应用过滤
bun run dev --filter=docs
bun run build --filter=payloadcms-website-template

# 创建新项目
cd scripts/create-monorepo-app
bun install && bun link
create-monorepo-app        # 交互式选择模板
create-monorepo-app --template-dir /path/to/template
```

## 包引用规范

### Workspace 包名映射

| 目录 | 包名 | 引用方式 |
|------|------|----------|
| packages/ui | @repo/ui | `workspace:*` |
| packages/logger | @repo/logger | `workspace:*` |
| packages/schemas | @repo/schemas | `workspace:*` |
| packages/shared | @repo/shared | `workspace:*` |
| packages/typescript-config | @repo/typescript-config | `workspace:*` |
| packages/rules | @repo/rules | `workspace:*`（私有） |
| apps/core | @forge-town/oxlint-plugin-puck | GitHub Packages 私有包 |
| packages/oxlint-config | @repo/oxlint-config | `workspace:*` |
| packages/oxc-formatter-config | @repo/oxc-formatter-config | `workspace:*` |

### @repo/ui 组件导出

按子路径导出，非统一入口：
```typescript
import { Button } from "@repo/ui/button";
import { cn } from "@repo/ui/lib/utils";
```

可用组件：`avatar`, `badge`, `button`, `card`, `code`, `context-menu`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `popover`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `table`, `textarea`, `toast`, `tooltip`

## 环境变量

### docs

`NODE_ENV`（默认 `development`）

### payloadcms-website-template

`PAYLOAD_SECRET`, `DATABASE_URI`, `NEXT_PUBLIC_SERVER_URL`

## 创建新应用模板

1. 在 `apps/` 下创建新目录，包含完整的可运行应用
2. 确保 `package.json` 包含标准 scripts：`dev`, `build`, `lint`, `check-types`, `quality`
3. 更新根目录 `README.md` 的模板列表
4. 测试 CLI 能正确识别和复制新模板

## 创建新共享包

1. 在 `packages/` 下创建目录，`package.json` 中 `name` 使用 `@repo/` 前缀
2. 添加 `type: "module"`，配置 `exports` 字段
3. 在根 `package.json` workspaces 中已自动包含（`packages/*`）
4. 在 `knip.json` 中配置 entry/project（如需要）

## 注意事项

- `.gitignore` 排除了大量 AI 工具的配置目录（`.claude`, `.windsurf`, `.trae` 等），新工具配置应遵循此模式
- `AGENTS.md` 本身被 `.gitignore` 排除，为本地文档
- Skills 位于 `.agents/skills/`，每个 Skill 包含 `SKILL.md` + `references/` 目录
- 模板仓库本身可直接开发，CLI 会优先检测当前目录是否为有效模板根（含 `apps/`, `packages/`, `turbo.json`）

## Puck 规则维护与分发工作流

`packages/rules` 是规则维护层，源码与测试位于 `src/plugins/*.ts`，由 `src/index.ts` 聚合成内部 rules registry。`apps/core` 是薄分发层，只负责把该 registry 适配成单个 `puck` plugin，并 bundle 为可发布的 `dist/index.js`。

- 16 个规则源文件均为 `OxlintRuleModule<MessageIds>` 类型化模块，`meta.type`、`meta.messages`、`create(context)` 返回 `TSESLint.RuleListener`
- 共享类型在 `src/types.ts`：`OxlintRuleContext`（扩展 oxlint 的 `filename`/`physicalFilename`）、`OxlintRuleModule`
- 语法约束 `erasableSyntaxOnly`（禁 enum/namespace/参数属性），模块解析 NodeNext，类型 import 一律带 `.js` 后缀
- 仓库内 oxlint 通过 `jsPlugins` 加载 `apps/core/src/index.ts`；外部消费方通过 `@forge-town/oxlint-plugin-puck` 加载 bundle 后的 `dist/index.js`
- 新增/修改规则后执行：`bun run check-types`（tsc 严格模式）→ `bun run lint`（加载 .ts 插件，模板规则对自身源码已豁免）→ `bun run build`（产出 dist/）
- `packages/rules` 禁止发布；`apps/core` 是唯一 Changesets 发布单元，构建产物不得保留 `@repo/*` 运行时依赖
- `.oxlintrc.json` 的 `jsPlugins` 以 `apps/core/src/index.ts` 为入口；`knip.json` 同时覆盖维护层与分发层
