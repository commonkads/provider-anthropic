# Changes — initial-version

## New files

| File | Description |
|------|-------------|
| `package.json` | Package manifest — `@commonkads/provider-anthropic` |
| `src/claude.ts` | `ClaudeTextInference` — `IInferenceProvider` backed by Anthropic Messages API |
| `src/index.ts` | Public exports and `registerAnthropicProviders()` |
| `tsconfig.json` | TypeScript build config |
| `tsconfig.test.json` | TypeScript config for type-checking tests |
| `eslint.config.mjs` | ESLint config (typescript-eslint + prettier) |
| `.github/workflows/ci.yml` | CI workflow (lint, compile, pack) |
| `.github/workflows/release.yml` | Release workflow (changesets publish) |
| `.changeset/config.json` | Changesets configuration |
| `.npmrc` | Registry routing for `@commonkads` |
| `README.md` | Usage documentation |
| `CHANGELOG.md` | Initial changelog entry |

## Modified files

None — brand new repository.

## Deviations from design

None.
