# @commonkads/provider-anthropic

> **Disclaimer:** This project is an independent open-source software implementation inspired by the CommonKADS knowledge engineering methodology (Schreiber et al.). It is not affiliated with or endorsed by the original methodology authors or any third-party trademark holders.

Anthropic Claude provider implementation for the [CommonKADS engine](https://github.com/commonkads/engine).

## Provided implementations

| Export | Interface | Description |
|--------|-----------|-------------|
| `ClaudeTextInference` | `IInferenceProvider` | Anthropic Messages API |

## Usage

### Via the registry (recommended)

```ts
import { registerAnthropicProviders } from '@commonkads/provider-anthropic';
import { buildInference } from '@commonkads/engine';

// Call once at startup, before any buildInference calls.
registerAnthropicProviders();

const inference = buildInference({
  type: 'claude',
  model: 'claude-sonnet-5-5',
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

### Direct construction

```ts
import { ClaudeTextInference } from '@commonkads/provider-anthropic';

const inference = new ClaudeTextInference('claude-sonnet-5-5', {
  apiKey: process.env.ANTHROPIC_API_KEY,
  thinking: true,
});
```

## Third-party extension pattern

`registerAnthropicProviders()` is the official extension point for wiring providers into
the engine without forking it. See `@commonkads/provider-aws` for the full pattern
documentation.

## Credentials

Set `ANTHROPIC_API_KEY` or `ANTHROPIC_AUTH_TOKEN` in the environment, or pass `apiKey` /
`authToken` directly to the constructor.
