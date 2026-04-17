#!/usr/bin/env node
/**
 * yapper/evals/eval.js
 *
 * Measures verbosity expansion and accuracy retention across Yapper modes.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=your_key node evals/eval.js
 *   ANTHROPIC_API_KEY=your_key node evals/eval.js --mode professor
 *   ANTHROPIC_API_KEY=your_key node evals/eval.js --suite quick
 *
 * Options:
 *   --mode <techbro|professor|thesis|victorian>   Run a single mode only
 *   --suite <quick|full>                           quick = 2 prompts, full = all (default: full)
 *   --json                                         Output raw JSON results
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ──────────────────────────────────────────────────────────────────

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("❌  ANTHROPIC_API_KEY environment variable is not set.");
  process.exit(1);
}

const client = new Anthropic({ apiKey: API_KEY });
const MODEL = "claude-sonnet-4-20250514";

// ─── Yapper system prompts (mirrors skills/yapper.skill) ─────────────────────

const YAPPER_MODES = {
  baseline: null, // no system prompt — raw Claude
  techbro: `You are in Yapper TECHBRO mode. Expand every response by ~50%. Frame all elaboration in terms of scalability, impact, and velocity. Use startup polish. Spell out abbreviations. Never sacrifice technical accuracy.`,
  professor: `You are in Yapper PROFESSOR mode. Expand every response by ~150%. Define every concept on first mention. Show full reasoning, not just conclusions. Restate key points in different wording. Use generous transitions. Never sacrifice technical accuracy.`,
  thesis: `You are in Yapper THESIS mode. Expand every response by ~300%. Use academic verbosity. Step-by-step reasoning. Provide examples and analogies for every concept. Reach each conclusion through a visible chain of logic. Never sacrifice technical accuracy.`,
  victorian: `You are in Yapper VICTORIAN mode. Expand every response by ~500%. Render every technical utterance as a grand soliloquy of formal, archaic, dramatic prose. Give even boolean comparisons the weight of a parliamentary address. Never sacrifice technical accuracy.`,
};

// ─── Test prompts ─────────────────────────────────────────────────────────────

const PROMPTS = [
  {
    id: "react-rerender",
    label: "React re-render",
    prompt:
      "Why does passing an inline object as a React prop cause unnecessary re-renders?",
    // Keywords that must appear in a correct answer
    accuracy_keywords: ["reference", "equality", "useMemo", "render"],
  },
  {
    id: "git-commit",
    label: "Git commit message",
    prompt:
      'Write a git commit message for: "fixed a bug where users were logged out when their token was refreshed in a parallel request"',
    accuracy_keywords: ["token", "auth", "fix", "race"],
  },
  {
    id: "big-o",
    label: "Big-O explanation",
    prompt: "Explain O(n log n) time complexity.",
    accuracy_keywords: ["n", "log", "sort", "divide"],
  },
  {
    id: "css-specificity",
    label: "CSS specificity",
    prompt: "How does CSS specificity work?",
    accuracy_keywords: ["selector", "id", "class", "weight"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { mode: null, suite: "full", json: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--mode" && args[i + 1]) opts.mode = args[++i];
    if (args[i] === "--suite" && args[i + 1]) opts.suite = args[++i];
    if (args[i] === "--json") opts.json = true;
  }
  return opts;
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function checkAccuracy(text, keywords) {
  const lower = text.toLowerCase();
  const found = keywords.filter((kw) => lower.includes(kw.toLowerCase()));
  return {
    score: found.length / keywords.length,
    found,
    missing: keywords.filter((kw) => !lower.includes(kw.toLowerCase())),
  };
}

async function runPrompt(prompt, systemPrompt) {
  const messages = [{ role: "user", content: prompt }];
  const params = { model: MODEL, max_tokens: 1000, messages };
  if (systemPrompt) params.system = systemPrompt;

  const start = Date.now();
  const response = await client.messages.create(params);
  const elapsed = Date.now() - start;

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return { text, elapsed };
}

function bar(ratio, width = 20) {
  const filled = Math.round(ratio * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function color(code, text) {
  return `\x1b[${code}m${text}\x1b[0m`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs();

  const modesToRun = opts.mode
    ? ["baseline", opts.mode]
    : Object.keys(YAPPER_MODES);

  const promptsToRun =
    opts.suite === "quick" ? PROMPTS.slice(0, 2) : PROMPTS;

  if (!opts.json) {
    console.log(color("1;36", "\n🗣️  YAPPER EVAL\n"));
    console.log(
      `  Model   : ${MODEL}`
    );
    console.log(`  Modes   : ${modesToRun.join(", ")}`);
    console.log(`  Prompts : ${promptsToRun.length}`);
    console.log(`  Suite   : ${opts.suite}\n`);
    console.log("─".repeat(60));
  }

  const results = {};

  // Run baseline first so we can compute expansion ratios
  const baselineResults = {};
  if (!opts.json) process.stdout.write("\n  Running baseline");

  for (const p of promptsToRun) {
    if (!opts.json) process.stdout.write(".");
    const { text, elapsed } = await runPrompt(p.prompt, null);
    baselineResults[p.id] = {
      words: countWords(text),
      accuracy: checkAccuracy(text, p.accuracy_keywords),
      elapsed,
      text,
    };
  }
  if (!opts.json) console.log(" ✓");

  results["baseline"] = baselineResults;

  // Run each yapper mode
  for (const mode of modesToRun.filter((m) => m !== "baseline")) {
    const modeResults = {};
    if (!opts.json) process.stdout.write(`  Running ${mode}   `);

    for (const p of promptsToRun) {
      if (!opts.json) process.stdout.write(".");
      const { text, elapsed } = await runPrompt(
        p.prompt,
        YAPPER_MODES[mode]
      );
      modeResults[p.id] = {
        words: countWords(text),
        accuracy: checkAccuracy(text, p.accuracy_keywords),
        elapsed,
        text,
      };
    }
    if (!opts.json) console.log(" ✓");
    results[mode] = modeResults;
  }

  // ─── Output ────────────────────────────────────────────────────────────────

  if (opts.json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  console.log("\n" + "─".repeat(60));
  console.log(color("1;33", "\n  RESULTS BY PROMPT\n"));

  for (const p of promptsToRun) {
    console.log(color("1;37", `  ▸ ${p.label}`));
    console.log(`    ${"Mode".padEnd(12)} ${"Words".padStart(6)}  ${"×baseline".padStart(9)}  ${"Accuracy".padStart(10)}  Keywords`);
    console.log(`    ${"────".padEnd(12)} ${"─────".padStart(6)}  ${"─────────".padStart(9)}  ${"────────".padStart(10)}  ────────`);

    const baseWords = baselineResults[p.id].words;

    for (const mode of modesToRun) {
      const r = results[mode][p.id];
      const expansion = r.words / baseWords;
      const acc = r.accuracy.score;
      const accBar = bar(acc, 10);
      const expStr =
        mode === "baseline"
          ? "  (base)"
          : color(
              expansion >= 1.5 ? "32" : expansion >= 1.0 ? "33" : "31",
              `  ×${expansion.toFixed(2)}`
            );
      const accColor = acc >= 0.75 ? "32" : acc >= 0.5 ? "33" : "31";
      const missing =
        r.accuracy.missing.length > 0
          ? color("90", ` [-${r.accuracy.missing.join(", ")}]`)
          : color("32", " ✓");

      console.log(
        `    ${mode.padEnd(12)} ${String(r.words).padStart(6)}  ${expStr.padStart(9)}  ${color(accColor, `${Math.round(acc * 100)}%`).padStart(10)}  ${accBar}${missing}`
      );
    }
    console.log();
  }

  // ─── Summary ───────────────────────────────────────────────────────────────

  console.log("─".repeat(60));
  console.log(color("1;33", "\n  SUMMARY\n"));
  console.log(
    `  ${"Mode".padEnd(12)} ${"Avg expansion".padStart(14)}  ${"Avg accuracy".padStart(13)}  ${"Avg latency".padStart(12)}`
  );
  console.log(
    `  ${"────".padEnd(12)} ${"──────────────".padStart(14)}  ${"────────────".padStart(13)}  ${"───────────".padStart(12)}`
  );

  for (const mode of modesToRun) {
    const modeData = results[mode];
    const expansions = promptsToRun.map((p) => {
      const base = baselineResults[p.id].words;
      return modeData[p.id].words / base;
    });
    const accuracies = promptsToRun.map((p) => modeData[p.id].accuracy.score);
    const latencies = promptsToRun.map((p) => modeData[p.id].elapsed);

    const avgExp = expansions.reduce((a, b) => a + b, 0) / expansions.length;
    const avgAcc = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    const avgLat = latencies.reduce((a, b) => a + b, 0) / latencies.length;

    const expColor =
      mode === "baseline" ? "37" : avgExp >= 1.5 ? "32" : avgExp >= 1.0 ? "33" : "31";
    const accColor = avgAcc >= 0.75 ? "32" : avgAcc >= 0.5 ? "33" : "31";

    console.log(
      `  ${mode.padEnd(12)} ${color(expColor, `×${avgExp.toFixed(2)}`).padStart(14)}  ${color(accColor, `${Math.round(avgAcc * 100)}%`).padStart(13)}  ${`${Math.round(avgLat)}ms`.padStart(12)}`
    );
  }

  // Save full results to file
  const outPath = path.join(__dirname, "results.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(color("90", `\n  Full results saved to evals/results.json`));
  console.log();
}

main().catch((err) => {
  console.error("❌  Eval failed:", err.message);
  process.exit(1);
});
