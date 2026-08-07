# @repo/rules

Puck 的内部规则维护层。

- `src/plugins/*`：规则实现及单元测试
- `src/index.ts`：供分发层消费的规则 registry
- 不直接发布到 registry

外部分发由 `apps/core` 负责。
