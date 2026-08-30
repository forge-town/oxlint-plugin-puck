# oxlint-plugin-puck

Puck 的公开 Oxlint plugin。首个版本只包含 `no-let` 和 `no-try-catch` 两条规则。

## 安装

```sh
bun add --dev oxlint oxlint-plugin-puck
```

## 配置

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

`puck/no-let` 禁止 `let` 声明。`puck/no-try-catch` 禁止所有 `try` 语句，包括 `try/catch` 和 `try/finally`。

公开包不需要 Forge Town 权限，也不需要配置 GitHub Packages token。
