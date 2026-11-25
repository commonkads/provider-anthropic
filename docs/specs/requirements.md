# Requirements — @commonkads/provider-anthropic

## Overview

Anthropic Claude provider implementation for the [CommonKADS engine](https://github.com/commonkads/engine). Provides `IInferenceProvider` backed by the Anthropic Messages API.

## REQ-1 — ClaudeTextInference

Implements `IInferenceProvider`. Constructor accepts `modelId: string` and `ClaudeTextInferenceOptions`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | — | Anthropic API key; falls back to SDK env-var resolution (`ANTHROPIC_API_KEY`) |
| `authToken` | `string` | — | OAuth Bearer token alternative to `apiKey` (`ANTHROPIC_AUTH_TOKEN`) |
| `maxTokens` | `number` | `8192` | Maximum tokens in the response |
| `thinking` | `boolean` | `false` | Enable adaptive thinking (`{type: "adaptive"}`); requires a Claude 4.6+ model |
| `client` | `Anthropic` | — | Injectable for testing; defaults to a real `Anthropic` client |

`infer()` returns the concatenation of text content blocks only; thinking blocks are never included.

## REQ-2 — Registry Integration

`registerAnthropicProviders()` registers a builder for type `"claude"` via `registerProvider`. The `register` named export is an alias. `ClaudeProviderOptions` (`{ type: "claude"; model: string; apiKey?; authToken?; thinking? }`) is the config shape accepted by `buildInference`.

## REQ-3 — Credentials

Pass `apiKey` or `authToken` to the constructor, or set `ANTHROPIC_API_KEY` / `ANTHROPIC_AUTH_TOKEN` in the environment. No other configuration is required.

## Out of Scope

- Streaming responses
- Multi-turn conversation management
- File uploads or vision inputs
