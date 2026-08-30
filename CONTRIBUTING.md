# Contributing to Oxlint Plugin Puck

感谢你的贡献。规则实现位于 `packages/rules`，公开和内部发布层分别位于
`apps/public` 和 `apps/core`。

## 开始开发

```sh
bun install
bun run quality
bun run build
```

提交前请确保质量检查和构建都通过。涉及规则行为的改动也应补充或更新对应的
Vitest 测试。

## 分支与提交

- 从 `main` 创建分支，使用 `feature/`、`fix/` 或 `chore/` 前缀。
- 每个独立的用户可见改动都要添加 Changeset：`bun run changeset`。
- 提交信息使用简短、可读的动词开头，例如 `fix(rules): handle spread attributes`。
- 不要提交 token、`.env` 文件或构建产物。

## Pull Request

Pull Request 应说明改动目的、验证方式以及是否包含 Changeset。提交前请确认：

- 相关测试、`bun run quality` 和 `bun run build` 已通过；
- 公开包的改动没有意外暴露内部规则；
- 文档和变更日志已同步更新（如适用）。

`main` 的合并约定是：通过 Pull Request、至少一名维护者审阅、所有必需检查通过后，
使用 **squash merge**。维护者应在 GitHub 的 branch ruleset 中强制执行这些要求。
合并后应删除源分支。

## 发布

合并到 `main` 后，Changesets workflow 会创建版本 Pull Request。版本 Pull Request
合并后，公开包发布到 npm，内部包发布到 GitHub Packages。请不要手动修改版本号。
