import Anthropic from "@anthropic-ai/sdk";

import type {
  InferenceOptions,
  InferenceProvider,
  ProviderFileConfig,
} from "@commonkads/engine";
import {
  createDiagnosticsLogger,
  loadProviderConfig,
} from "@commonkads/engine";

const DEFAULT_MAX_TOKENS = 8192;
const logger = createDiagnosticsLogger("providers:claude");

type AnthropicFileConfig = ProviderFileConfig & { authToken?: string };

export interface ClaudeTextInferenceOptions {
  apiKey?: string;
  /** OAuth Bearer token (alternative to apiKey; maps to ANTHROPIC_AUTH_TOKEN). */
  authToken?: string;
  maxTokens?: number;
  /** Adaptive thinking for better reasoning on complex evaluation steps (default false). Requires a Claude 4.6+ model. */
  thinking?: boolean;
  /** Path to a provider config file; defaults to ~/.commonkads/anthropic.yml. */
  configFile?: string;
  /** Injectable for testing; defaults to a real `Anthropic` client. */
  client?: Anthropic;
}

/** `InferenceProvider` backed by the Anthropic Messages API. */
export class ClaudeTextInference implements InferenceProvider {
  private readonly client: Anthropic;
  private readonly modelId: string;

  constructor(
    modelId?: string,
    private readonly options: ClaudeTextInferenceOptions = {},
  ) {
    const fileConfig = loadProviderConfig<AnthropicFileConfig>(
      "anthropic",
      options.configFile,
    );

    let resolvedModel: string;
    let modelSource: string;
    if (modelId !== undefined) {
      resolvedModel = modelId;
      modelSource = "explicit-arg";
    } else if (fileConfig.modelId !== undefined) {
      resolvedModel = fileConfig.modelId;
      modelSource = "config-file";
    } else {
      throw new Error(
        "modelId is required: pass it or set modelId in ~/.commonkads/providers/anthropic.yml",
      );
    }
    this.modelId = resolvedModel;

    const resolvedApiKey =
      options.apiKey ?? process.env["ANTHROPIC_API_KEY"] ?? fileConfig.apiKey;
    const resolvedAuthToken =
      options.authToken ??
      process.env["ANTHROPIC_AUTH_TOKEN"] ??
      fileConfig.authToken;
    const apiKeySource =
      options.apiKey !== undefined
        ? "explicit-arg"
        : process.env["ANTHROPIC_API_KEY"] !== undefined
          ? "env-var"
          : fileConfig.apiKey !== undefined
            ? "config-file"
            : "sdk-default";

    logger.info(`config: model="${resolvedModel}" source=${modelSource}`);
    if (resolvedApiKey !== undefined || resolvedAuthToken !== undefined) {
      logger.info(`config: apiKey=*** source=${apiKeySource}`);
    } else {
      logger.info(`config: apiKey=<none> source=${apiKeySource}`);
    }

    this.client =
      options.client ??
      new Anthropic(
        resolvedApiKey
          ? { apiKey: resolvedApiKey }
          : resolvedAuthToken
            ? { authToken: resolvedAuthToken }
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
