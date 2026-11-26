import { registerProvider } from "@commonkads/engine";
import { ClaudeTextInference } from "./claude.js";

export { ClaudeTextInference };
export type { ClaudeTextInferenceOptions } from "./claude.js";

export interface ClaudeProviderOptions {
  type: "claude";
  model?: string;
  apiKey?: string;
  authToken?: string;
  thinking?: boolean;
}

export function registerAnthropicProviders(): void {
  registerProvider("claude", (opts) => {
    const o = opts as unknown as ClaudeProviderOptions;
    return new ClaudeTextInference(o.model, {
      apiKey: o.apiKey,
      authToken: o.authToken,
      thinking: o.thinking ?? true,
    });
  });
}

export { registerAnthropicProviders as register };
