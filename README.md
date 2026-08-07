# Oxlint Plugin Puck

Forge Town 内部维护的 Oxlint JS plugin。规则实现在 `packages/rules` 维护，`apps/core` 是独立的分发适配层，并以私有 GitHub Package `@forge-town/oxlint-plugin-puck` 发布。

## 仓库结构

```text
apps/
├── core/                # 薄分发层：适配、bundle、发布
└── docs/                # 规则文档站
packages/
├── rules/               # 规则实现、单元测试与内部 registry
├── oxlint-config/       # 仓库内部共享的 Oxlint 配置
└── ...                  # 其他内部共享包
```

`packages/rules/src/index.ts` 聚合所有被维护的规则。`apps/core/src/index.ts` 只负责定义最终的 `puck` plugin，并在构建时把内部规则 bundle 到 `dist/index.js`，因此发布包没有 `@repo/*` 运行时依赖。

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
npm pack --dry-run ./apps/core
```

## 安装私有包

消费项目需要配置 GitHub Packages registry：

```ini
# .npmrc
@forge-town:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

`NODE_AUTH_TOKEN` 使用具有 `read:packages` 权限的 GitHub classic PAT：

```sh
export NODE_AUTH_TOKEN=github_pat_xxx
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

合并到 `main` 后，`.github/workflows/release.yml` 会通过 Changesets 创建版本 PR；版本 PR 合并后使用仓库的 `GITHUB_TOKEN` 发布到 Forge Town GitHub Packages。

手动发布前先配置具有 `write:packages` 权限的 token：

```sh
export NODE_AUTH_TOKEN=github_pat_xxx
bun run quality
bun run build
bun run version-packages
bun run release
```

不要把 GitHub token 写入或提交到 `.npmrc`。
