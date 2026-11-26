import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import Anthropic from "@anthropic-ai/sdk";

import { ClaudeTextInference } from "./claude.js";

let dir: string;

before(() => {
  dir = mkdtempSync(join(tmpdir(), "ck-claude-test-"));
});

after(() => {
  rmSync(dir, { recursive: true, force: true });
});

function stubClient(): Anthropic {
  return {
    messages: {
      create: async () => ({ content: [{ type: "text", text: "ok" }] }),
    },
  } as unknown as Anthropic;
}

describe("ClaudeTextInference config resolution", () => {
  it("resolves modelId from explicit arg", () => {
    assert.doesNotThrow(
      () =>
        new ClaudeTextInference("claude-3-5-haiku-latest", {
          client: stubClient(),
        }),
    );
  });

  it("resolves modelId from config file", () => {
    const cfg = join(dir, "anthropic.yml");
    writeFileSync(cfg, "modelId: claude-3-5-haiku-latest\n");
    assert.doesNotThrow(
      () =>
        new ClaudeTextInference(undefined, {
          configFile: cfg,
          client: stubClient(),
        }),
    );
  });

  it("throws when modelId is absent and config file has no model", () => {
    const cfg = join(dir, "no-model.yml");
    writeFileSync(cfg, "apiKey: sk-test\n");
    assert.throws(
      () =>
        new ClaudeTextInference(undefined, {
          configFile: cfg,
          client: stubClient(),
        }),
      /modelId is required/,
    );
  });

  it("throws when neither modelId nor config file is provided", () => {
    assert.throws(
      () =>
        new ClaudeTextInference(undefined, {
          configFile: join(dir, "ghost.yml"),
        }),
      /Config file not found/,
    );
  });

  it("explicit apiKey in options takes priority over config file", () => {
    const cfg = join(dir, "apikey.yml");
    writeFileSync(cfg, "modelId: claude-3-5-haiku-latest\napiKey: from-file\n");
    assert.doesNotThrow(
      () =>
        new ClaudeTextInference(undefined, {
          apiKey: "from-options",
          configFile: cfg,
          client: stubClient(),
        }),
    );
  });

  it("env var ANTHROPIC_API_KEY takes priority over config file", () => {
    const cfg = join(dir, "envvar.yml");
    writeFileSync(cfg, "modelId: claude-3-5-haiku-latest\napiKey: from-file\n");
    const prev = process.env["ANTHROPIC_API_KEY"];
    process.env["ANTHROPIC_API_KEY"] = "from-env";
    try {
      assert.doesNotThrow(
        () =>
          new ClaudeTextInference(undefined, {
            configFile: cfg,
            client: stubClient(),
          }),
      );
    } finally {
      if (prev === undefined) delete process.env["ANTHROPIC_API_KEY"];
      else process.env["ANTHROPIC_API_KEY"] = prev;
    }
  });
});
