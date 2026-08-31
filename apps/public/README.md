# oxlint-plugin-puck

Puck 的公开 Oxlint plugin。当前包含 `no-let`、`no-try-catch`、`no-use-effect`、`newline-before-return` 和 `jsx-sort-props` 五条规则。

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
    "puck/no-try-catch": "error",
    "puck/no-use-effect": "error",
    "puck/newline-before-return": "error",
    "puck/jsx-sort-props": "error"
  }
}
```

`puck/no-let` 禁止 `let` 声明。`puck/no-try-catch` 禁止所有 `try` 语句，包括 `try/catch` 和 `try/finally`。`puck/no-use-effect` 禁止 React effect hooks（包括 `useEffect`、`useLayoutEffect` 及符合 `use*Effect` 命名模式的函数）。`puck/newline-before-return` 要求 `return` 前恰好保留一行空行，并支持自动修复。`puck/jsx-sort-props` 强制 JSX 属性按配置排序，并支持自动修复。

`puck/jsx-sort-props` 与 `react/jsx-sort-props` 使用相同的经典配置选项。不要同时启用两个规则，以免产生重复诊断。

公开包不需要 Forge Town 权限，也不需要配置 GitHub Packages token。
