import Anthropic from "@anthropic-ai/sdk";

import type {
  InferenceOptions,
  IInferenceProvider,
} from "@commonkads/engine";
import { createDiagnosticsLogger } from "@commonkads/engine";

const DEFAULT_MAX_TOKENS = 8192;
const logger = createDiagnosticsLogger("providers:claude");

export interface ClaudeTextInferenceOptions {
  apiKey?: string;
  /** OAuth Bearer token (alternative to apiKey; maps to ANTHROPIC_AUTH_TOKEN). */
  authToken?: string;
  maxTokens?: number;
  /** Adaptive thinking for better reasoning on complex evaluation steps (default false). Requires a Claude 4.6+ model. */
  thinking?: boolean;
  /** Injectable for testing; defaults to a real `Anthropic` client. */
  client?: Anthropic;
}

/** `IInferenceProvider` backed by the Anthropic Messages API. */
export class ClaudeTextInference implements IInferenceProvider {
  private readonly client: Anthropic;

  constructor(
    private readonly modelId: string,
    private readonly options: ClaudeTextInferenceOptions = {},
  ) {
    this.client =
      options.client ??
      new Anthropic(
        options.apiKey
          ? { apiKey: options.apiKey }
          : options.authToken
            ? { authToken: options.authToken }
            : undefined,
      );
  }

  async infer(prompt: string, options: InferenceOptions = {}): Promise<string> {
    logger.debug(
      `calling model=${this.modelId} promptLength=${prompt.length} explain=${Boolean(options.explain)}`,
    );

    const response = await this.client.messages.create({
      model: this.modelId,
      max_tokens: this.options.maxTokens ?? DEFAULT_MAX_TOKENS,
      system: options.systemPrompt,
      thinking:
        (this.options.thinking ?? false) ? { type: "adaptive" } : undefined,
      messages: [{ role: "user", content: prompt }],
    });

    return response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");
  }
}
