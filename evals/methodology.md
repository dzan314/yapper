# Yapper Evaluation Methodology

## Overview

This document describes the evaluation framework used to measure Yapper's 
effectiveness. Evaluations are designed to verify three core claims:

1. Verbosity is increased substantially
2. Technical accuracy is maintained at 100%
3. Developer comprehension is meaningfully improved

---

## Eval Suite Structure

### Eval 1: Verbosity Ratio

**Metric:** Token count ratio (yapper / baseline)  
**Target:** ≥ 2.0× in Professor mode, ≥ 3.0× in Thesis mode  
**Method:** Submit 20 standard development questions to baseline and yapper-enabled 
models. Compute token ratio for each. Report mean, median, and standard deviation.

**Pass criteria:** Mean expansion ≥ 2.0× for Professor, no response shorter than baseline.

---

### Eval 2: Accuracy Preservation

**Metric:** Technical correctness score (0–100, human-reviewed)  
**Target:** 100% — zero accuracy regressions versus baseline  
**Method:** 50 questions with ground-truth correct answers (algorithmic, factual, 
diagnostic). Both baseline and yapper responses scored by two independent reviewers 
against rubric. Any factual error introduced by yapper is a failing result.

**Pass criteria:** Yapper accuracy score ≥ baseline accuracy score on all 50 questions.

---

### Eval 3: Concept Definition Coverage

**Metric:** Percentage of technical terms defined on first mention  
**Target:** ≥ 90% in Professor mode, 100% in Thesis mode  
**Method:** Parse responses for technical vocabulary (predefined glossary of 200 terms). 
Check whether each term's first occurrence in the response is accompanied by a definition 
or explanatory clause within the same or adjacent sentence.

**Pass criteria:** ≥ 90% coverage in Professor mode, ≥ 99% in Thesis mode.

---

### Eval 4: Transition Phrase Usage

**Metric:** Presence of at least one transition phrase per 150 tokens  
**Target:** ≥ 1 transition phrase per 150-token segment  
**Method:** Segment responses into 150-token windows. Check each window for presence 
of required transition phrases from the approved list in `skills/yapper.skill`.

**Pass criteria:** ≥ 85% of windows contain at least one transition phrase.

---

### Eval 5: Redundancy Quality

**Metric:** Proportion of restatements that rephrase rather than copy  
**Target:** 100% — no copy-paste redundancy  
**Method:** Identify sentences that restate a previously made point. Use semantic 
similarity scoring (cosine similarity on embeddings). Flag any restatement with 
similarity > 0.92 to the original as a copy-paste violation.

**Pass criteria:** Zero copy-paste redundancy violations across all evaluated responses.

---

### Eval 6: Developer Comprehension Study

**Metric:** "Do you understand why this happened?" response rate  
**Target:** ≥ 25 percentage point improvement over baseline  
**Method:** Present 20 developers with either a baseline or yapper-processed debugging 
explanation. Ask: "After reading this, do you understand why the bug occurred and how 
to prevent it in future?" Score Yes/Partially/No. Compare distribution between groups.

**Pass criteria:** Yapper group shows ≥ 25pp higher "Yes" response rate.

---

## Running the Evals

```bash
# Run full eval suite
npx yapper-evals run --all

# Run specific eval
npx yapper-evals run --eval verbosity-ratio
npx yapper-evals run --eval accuracy-preservation

# Generate report
npx yapper-evals report --output ./evals/latest-report.md
```

*Note: Human-reviewed evals (Accuracy Preservation, Comprehension Study) require 
manual review steps. The CLI will pause and prompt reviewers at the appropriate stages.*
