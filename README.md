# Monorepo Template (Bun + Turborepo)

一个基于 [Bun](https://bun.sh/) 和 [Turborepo](https://turbo.build/) 的 monorepo 项目模板，内置多个可直接使用的应用模板。通过命令行工具 `create-monorepo-app` 一键拆分模板，生成你的新项目。

---

## 快速开始：创建新项目

### 1. 克隆模板仓库

```sh
git clone <repo-url> monorepo-template-bun
cd monorepo-template-bun
```

### 2. 全局安装 CLI

在模板仓库根目录执行：

```sh
cd scripts/create-monorepo-app
bun install
bun link
```

安装完成后，在任意位置都能用 `create-monorepo-app` 命令。

> 脚本会自动检测当前目录是否是模板仓库，因此在模板仓库内直接运行即可。如果在其他目录运行，需加 `--template-dir` 参数指定模板位置。

### 3. 运行创建脚本

在模板仓库根目录运行：

```sh
cd /path/to/monorepo-template-bun
create-monorepo-app
```

或在其他目录指定模板位置：

```sh
create-monorepo-app --template-dir /path/to/monorepo-template-bun
```

### 交互流程

运行命令后，脚本会引导你完成以下步骤：

1. **输入项目名称** — 例如 `my-new-project`
2. **指定输出目录** — 默认 `./<project-name>`
3. **选择 App 模板** — 多选你想要包含的应用模板

```
? Project name: my-new-project
? Output directory: ./my-new-project
? Select app templates to include:
  ◉ docs
  ◉ payloadcms-website-template
  ◉ expo-react-native-template
  ◉ hono-server-template
  ◉ tauri-app-template
  ◉ uniapp-mp-weixin-template
  ◉ wxt-browser-extension-template
```

完成后，进入项目并安装依赖：

```sh
cd my-new-project
bun install
bun run dev
```

---

## 模板中包含的内容

### App 模板

| 模板 | 技术栈 | 说明 |
|------|--------|------|
| `expo-react-native-template` | Expo + React Native | 基于 Expo 官方默认模板并预置 NativeWind/Tailwind CSS |
| `hono-server-template` | Hono + Bun | 从 Ordine 服务端抽出的轻量 API 服务模板 |
| `docs` | TanStack Start | 技术文档项目（文件路由 + 侧边栏导航） |
| `payloadcms-website-template` | Next.js + Payload CMS | 基于 Payload CMS 的内容管理网站 |
| `tauri-app-template` | Tauri + Vite | 跨平台桌面应用 |
| `uniapp-mp-weixin-template` | uni-app + Vue 3 | 面向微信小程序的 uni-app 模板 |
| `wxt-browser-extension-template` | WXT + React | 基于 WXT 的浏览器插件模板，预置 Zustand 状态示例 |

### 共享 Packages

- `@repo/ui` — React 组件库，供各应用共享
- `@repo/logger` — 日志工具
- `@repo/schemas` — 数据校验 schema
- `@repo/shared` — 通用工具函数
- `@repo/typescript-config` — 共享 TypeScript 配置
- `@repo/rules` — 自定义 Oxlint JS 规则
- `@repo/oxlint-config` — 共享 Oxlint 配置
- `@repo/oxc-formatter-config` — 共享 Oxc 格式化配置

---

## 技术栈

- **包管理器**: [Bun](https://bun.sh/) (v1.3.11+)
- **任务编排**: [Turborepo](https://turbo.build/) — 缓存、并行构建
- **类型检查**: TypeScript 5.9
- **代码检查**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) — 替代 ESLint，速度更快
- **代码格式化**: Prettier + Oxc
- **包发布**: [Changesets](https://github.com/changesets/changesets) — 版本管理与发布
- **无用代码检测**: [Knip](https://knip.dev/)

---

## 常用命令

```sh
# 开发所有应用
bun run dev

# 构建所有应用和包
bun run build

# 运行测试
bun run test

# 代码检查
bun run lint

# 类型检查
bun run check-types

# 质量检查（lint + type + test）
bun run quality

# 提交前安装 Lefthook，并通过 pre-commit 执行质量检查
bun run prepare

# 格式化代码
bun run format

# 检测无用依赖/导出
bun run knip

# 版本管理与发布
bun run changeset         # 记录变更，生成 changelog 输入
bun run version-packages  # 更新版本并生成 CHANGELOG.md
bun run release           # 发布包
```

### 针对单个应用

```sh
# 只开发 web 应用
bun run dev --filter=web

# 只构建某个应用
bun run build --filter=payloadcms-website-template
```

---

## 项目结构

```
monorepo-template-bun/
├── apps/                          # 应用模板
│   ├── docs/
│   ├── expo-react-native-template/
│   ├── hono-server-template/
│   ├── payloadcms-website-template/
│   ├── tauri-app-template/
│   ├── uniapp-mp-weixin-template/
│   └── wxt-browser-extension-template/
├── packages/                      # 共享包
│   ├── ui/                        # React 组件库
│   ├── logger/                    # 日志
│   ├── schemas/                   # Schema 定义
│   ├── shared/                    # 通用工具
│   ├── typescript-config/         # TS 配置
│   ├── rules/                     # 自定义 Oxlint 规则
│   ├── oxlint-config/             # Linter 配置
│   └── oxc-formatter-config/      # 格式化配置
├── scripts/
│   └── create-monorepo-app/       # 项目创建脚本
├── turbo.json                     # Turborepo 任务配置
└── package.json                   # 工作区根配置
```

---

## 环境要求

- [Node.js](https://nodejs.org/) >= 20
- [Bun](https://bun.sh/) >= 1.3.11

---

## License

MIT
