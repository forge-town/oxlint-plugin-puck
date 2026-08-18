# Public and private plugin distribution

## Status

Accepted on 2026-08-18.

## Context

Forge Town maintains one set of Oxlint rule implementations, but needs two products with different audiences and release registries:

- `@forge-town/oxlint-plugin-puck` is the restricted internal package containing the complete rule registry.
- `oxlint-plugin-puck` is the public package whose first release contains only `no-let` and `no-try-catch`.

Splitting rule implementations or registries inside `packages/rules` would create two maintenance paths and move product policy into the maintenance layer.

## Decision

`packages/rules` remains the single maintenance layer and keeps its complete root registry. It exposes direct source subpaths only for rules selected by a distribution app.

`apps/core` remains the internal distribution and consumes the complete registry. `apps/public` is the public distribution and imports only the selected rule subpaths. Each app owns its package name, public surface, bundle, registry, documentation, version, and release policy.

The public name `no-try-catch` adapts the existing internal `no-try` implementation without renaming or duplicating that implementation.

## Consequences

- Rule fixes are made once in `packages/rules`.
- Adding a public rule requires an explicit change in `apps/public`; internal rules cannot become public accidentally through the complete registry.
- The public bundle contains only reachable selected implementations and has no `@repo/*` runtime dependency.
- Changesets publishes each app according to its own `publishConfig.registry`: npmjs for the public package and GitHub Packages for the internal package.
- CI needs both an npm publishing token and the repository `GITHUB_TOKEN`.
