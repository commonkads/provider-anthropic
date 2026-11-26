# Design — @commonkads/provider-anthropic

## 1. Component Overview

| File | Export | Engine Interface |
|------|--------|-----------------|
| `src/claude.ts` | `ClaudeTextInference`, `ClaudeTextInferenceOptions` | `IInferenceProvider` |
| `src/index.ts` | `registerAnthropicProviders`, `register`, `ClaudeProviderOptions` | — |

## 2. Interface Implementation

`ClaudeTextInference implements IInferenceProvider`

The `infer(prompt, options?)` method:
1. Calls `this.client.messages.create` with the model, `max_tokens`, optional `system` prompt, optional adaptive `thinking` parameter, and a single user message
2. Filters the response content array to `TextBlock` entries only
3. Joins and returns their `text` values

## 3. Options Schema

```ts
interface ClaudeTextInferenceOptions {
  apiKey?: string;
  authToken?: string;
  maxTokens?: number;   // default 8192
  thinking?: boolean;   // default false; requires Claude 4.6+
  client?: Anthropic;   // injectable for testing
}
```

## 4. Registry Wiring

```ts
registerAnthropicProviders();
// Registers: registerProvider('claude', (opts) => new ClaudeTextInference(opts.model, { ... }))

const inference = buildInference({ type: 'claude', model: 'claude-sonnet-5-5' });
```
