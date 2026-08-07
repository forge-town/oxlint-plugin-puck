# @forge-town/oxlint-plugin-puck

Puck 的私有分发包。这个 app 不维护规则实现，只把 `@repo/rules` 的内部 registry 适配为一个 Oxlint plugin，并 bundle 成无 workspace 运行时依赖的 `dist/index.js`。

```sh
bun add --dev oxlint @forge-town/oxlint-plugin-puck
```

```json
{
  "jsPlugins": [
    {
      "name": "puck",
      "specifier": "@forge-town/oxlint-plugin-puck"
    }
  ],
  "rules": {
    "puck/no-let": "error"
  }
}
```
