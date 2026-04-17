# Yapper Eval Methodology

How `eval.js` works, what it measures, and how to interpret its output - all in this document.

---

## What Is Being Tested

Yapper makes two claims:

1. **Verbosity** — responses expand significantly relative to a baseline (2–4× depending on mode)
2. **Accuracy** — technical correctness is preserved despite the expansion

The eval tests both claims against every mode across a fixed set of prompts.

---

## Setup

Each eval run sends the same prompt twice: once with no system prompt (baseline) and once with the Yapper mode system prompt injected. The model, temperature, and max tokens are held constant across all runs.

- **Model**: `claude-sonnet-4-20250514`
- **Max tokens**: 1000
- **Temperature**: default (not set — consistent across runs)
- **Baseline**: raw Claude with no system prompt

---

## Prompts

Four prompts are used, selected to cover different response types — explanation, generation, teaching, and reference lookup:

| ID | Prompt | Type |
|---|---|---|
| `react-rerender` | Why does passing an inline object as a React prop cause unnecessary re-renders? | Explanation |
| `git-commit` | Write a commit message for a token refresh race condition fix | Generation |
| `big-o` | Explain O(n log n) time complexity | Teaching |
| `css-specificity` | How does CSS specificity work? | Reference |

A `--suite quick` flag runs only the first two prompts for faster iteration.

---

## Metrics

### Expansion ratio

Word count of the Yapper response divided by word count of the baseline response for the same prompt.

```
expansion = yapper_words / baseline_words
```

A ratio of `×2.0` means the response is twice as long as the baseline. The advertised targets per mode are:

| Mode | Target expansion |
|---|---|
| techbro | ~×1.5 |
| professor | ~×2.5 |
| thesis | ~×4.0 |
| victorian | ~×5.0 |

### Accuracy score

Each prompt has a set of required keywords — terms that must appear in a technically correct answer. The accuracy score is the fraction of those keywords present in the response.

```
accuracy = keywords_found / keywords_total
```

A score of 100% means all expected technical terms appeared. Missing keywords are listed in the output so you can see exactly what was dropped.

The keyword sets are intentionally conservative — they capture core concepts, not exhaustive coverage. A response can score 100% and still be wrong in subtle ways; so treat this metric as a basic check, not a full correctness judgment.

### Latency

Time in milliseconds from API request to response. Longer responses will naturally take longer, so this metric is mostly useful for spotting anomalies.

---

## Interpreting Results

The terminal output color-codes expansion and accuracy:

- 🟢 Green — expansion ≥ ×1.5 / accuracy ≥ 75%
- 🟡 Yellow — expansion ≥ ×1.0 / accuracy ≥ 50%
- 🔴 Red — below threshold

A healthy run could look like this: all Yapper modes above ×1.5 expansion, all accuracy scores at 75%+. 
If a mode scores below ×1.0 expansion, the system prompt is not being followed. If accuracy drops below 50%, the verbosity expansion is likely diluting or displacing technical content.

---

## Limitations

**LLM outputs are non-deterministic.** meaning: word counts and keyword presence will vary between runs even with identical inputs. Run the full suite multiple times and compare `results.json` across runs to get a stable picture rather than treating any single run as definitive.

**Keyword accuracy is an approximation, not a guarantee.** A response can mention `useMemo` without explaining it correctly. The metric confirms presence, not correctness of usage.

**max_tokens is capped at 1000.** Thesis and Victorian modes may sometimes hit this ceiling, which will artificially suppress their expansion ratios. This is a known constraint of the eval setup — if in need of uncapped measures, increase `max_tokens` in `eval.js`.

**The baseline varies.** Claude is non-deterministic, so baseline word counts shift between runs. Expansion ratios are computed relative to the baseline in the same run, which controls for this — but this means ratios are not directly comparable across runs.

---

## Adding Prompts

To add a new test prompt, append an entry to the `PROMPTS` array in `eval.js`:

```js
{
  id: "your-id",
  label: "Human-readable label",
  prompt: "The question to send to the model",
  accuracy_keywords: ["term1", "term2", "term3"],
}
```

Keep `accuracy_keywords` to 3–5 terms that are genuinely important for a correct answer. Avoid  so commonly used words that would appear in any response (regardless of correctness and context).

---

## Output Files

After each run, full results (including raw response text) are saved to `evals/results.json`. This file is gitignored by default — commit it intentionally if you want to snapshot a particular run for comparison.
