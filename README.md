# Oxlint Plugin Puck

Forge Town 维护的 Oxlint JS plugin。规则统一在 `packages/rules` 维护，并通过两个独立 app 分发：公开 npm 包 `oxlint-plugin-puck` 首期只提供 `no-let` 和 `no-try-catch`，私有 GitHub Package `@forge-town/oxlint-plugin-puck` 提供完整内部规则集。

## 仓库结构

```text
apps/
├── core/                # 内部分发层：完整规则集，发布到 GitHub Packages
├── public/              # 公开分发层：精选规则，发布到 npmjs
└── docs/                # 规则文档站
packages/
├── rules/               # 规则实现、单元测试与内部 registry
├── oxlint-config/       # 仓库内部共享的 Oxlint 配置
└── ...                  # 其他内部共享包
```

`packages/rules/src/index.ts` 聚合所有被维护的规则。`apps/core` 消费完整 registry；`apps/public` 直接消费获准公开的规则子路径，避免把完整 registry 打进公开 bundle。两个 app 都会把所需实现 bundle 到 `dist/index.js`，发布包没有 `@repo/*` 运行时依赖。

仓库自身通过根依赖 `oxlint-plugin-puck-published` 消费已经发布的 package，所有内部 `.oxlintrc.json` 都从该 alias 加载 plugin。alias 使用 registry 的 `latest` dist-tag 避免同名的 `apps/core` 被误当成已发布产物，`bun.lock` 固定实际版本；`apps/core` 对 `@repo/rules` 的显式 `workspace:*` 构建依赖仍然保留。

## 本地开发

```sh
bun install
bun run quality
bun run build
```

分别验证规则维护层和分发层：

```sh
bun run --cwd packages/rules quality
bun run --cwd apps/core quality
bun run --cwd apps/core build
bun run --cwd apps/public quality
bun run --cwd apps/public build
npm pack --dry-run ./apps/core
npm pack --dry-run ./apps/public
```

## 安装公开包

公开包从 npmjs 安装，不需要额外 token：

```sh
bun add --dev oxlint oxlint-plugin-puck
```

```json
{
  "jsPlugins": [
    {
      "name": "puck",
      "specifier": "oxlint-plugin-puck"
    }
  ],
  "rules": {
    "puck/no-let": "error",
    "puck/no-try-catch": "error"
  }
}
```

## 安装私有包

消费项目需要配置 GitHub Packages registry：

```ini
# .npmrc
@forge-town:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

`GITHUB_PACKAGES_TOKEN` 使用具有 `read:packages` 权限的 GitHub classic PAT：

```sh
export GITHUB_PACKAGES_TOKEN=github_pat_xxx
bun add --dev oxlint @forge-town/oxlint-plugin-puck
```

配置 Oxlint：

```json
{
  "jsPlugins": [
    {
      "name": "puck",
      "specifier": "@forge-town/oxlint-plugin-puck"
    }
  ],
  "rules": {
    "puck/no-let": "error",
    "puck/strict-method-module": "error"
  }
}
```

## 发布

每次需要发布的改动都要创建 Changeset：

```sh
bun run changeset
```

合并到 `main` 后，`.github/workflows/release.yml` 会通过 Changesets 创建版本 PR；版本 PR 合并后，公开包使用仓库 secret `NPM_TOKEN` 发布到 npmjs，内部包使用仓库的 `GITHUB_TOKEN` 发布到 Forge Town GitHub Packages。

`NPM_TOKEN` 必须是允许发布 `oxlint-plugin-puck` 且可在 CI 中绕过发布 2FA 的 npm granular access token。GitHub Actions 还需要仓库级 `contents: write`、`packages: write` 和 `pull-requests: write` 权限；工作流已经显式声明这些权限。

手动发布前先配置具有 `write:packages` 权限的 token：

```sh
export GITHUB_PACKAGES_TOKEN=github_pat_xxx
export NODE_AUTH_TOKEN=npm_xxx
bun run quality
bun run build
bun run version-packages
bun run release
```

不要把 npm 或 GitHub token 写入或提交到 `.npmrc`。
