# /yapper-help Command

## Description

The `/yapper-help` command displays full documentation for the Yapper plugin, 
including all modes, commands, behaviours, configuration options, and usage examples. 
This command is itself rendered in Professor mode by default, because a help document 
that is not thoroughly elaborated would be somewhat contrary to the spirit of the plugin.

---

# Yapper — Full Documentation

## What is Yapper?

Yapper is a plugin and skill system for AI coding agents that enforces maximum 
verbosity, thorough elaboration, and exhaustive explanation across all responses. 
When active, it expands every reply by two to four hundred percent while maintaining 
complete technical accuracy. It is the structural, philosophical, and tonal inverse 
of compression-based AI plugins.

The core thesis of Yapper is simple: most AI-generated responses are optimised 
for brevity, and brevity is not always what the reader needs. A developer reading a 
code review at the end of a long day does not benefit from a one-line comment that 
says "wrong." They benefit from a comment that explains what is wrong, why it is wrong, 
what could happen if it stays wrong, and what to do about it — in complete sentences.

In other words: same answer, significantly more words, intentionally.

---

## All Commands

### Activation Commands

| Command | Effect |
|---------|--------|
| `/yapper` | Activate Yapper in Professor mode (default) |
| `/yapper techbro` | Activate Tech Bro mode |
| `/yapper professor` | Activate Professor mode |
| `/yapper thesis` | Activate Thesis mode |
| `/yapper victorian` | Activate Victorian Ultra mode |
| `stop yapping` | Deactivate Yapper entirely |

### Utility Commands

| Command | Effect |
|---------|--------|
| `/yapper-commit` | Generate a verbose, fully-explained Git commit message |
| `/yapper-review` | Perform a thorough multi-line PR review |
| `/yapper-expand` | Expand prose in a file (preserves code blocks, URLs, paths) |
| `/yapper-help` | Display this documentation |

---

## Mode Reference

### 💼 Tech Bro Mode (`/yapper techbro`)

**Expansion level:** approximately 50% above normal

Tech Bro mode is the lightest available mode. Responses are longer than a standard 
AI reply but not dramatically so. The primary effect is that sentences become 
complete, abbreviations are spelled out in full so the whole team can align on 
shared terminology, and every elaboration is framed in terms of its scalability, 
business impact, or downstream value. This mode is appropriate when you want 
slightly more context without dramatically impacting the reader's bandwidth — 
while still ensuring the core learnings land with the right level of visibility.

**Best for:** Async engineering updates, stakeholder-facing explanations, Slack 
threads where you need to surface the right context without going too deep into 
the weeds, situations where some elaboration is helpful but you still need to 
respect everyone's time and move fast.

---

### 🎓 Professor Mode (`/yapper professor`) — DEFAULT

**Expansion level:** approximately 150–200% above normal

Professor mode is the default and most commonly useful mode. Every technical concept 
is defined upon its first mention in the response. The reasoning behind conclusions 
is shown explicitly rather than merely stated. Key conclusions are restated in 
different wording after being reached, to reinforce comprehension. Transition phrases 
are used throughout to connect ideas in a logical flow. The tone is educational and 
accessible without being condescending.

**Best for:** Code reviews, debugging explanations, learning new concepts, 
documentation writing, any situation where the reader would benefit from 
understanding *why* as well as *what*.

---

### 📚 Thesis Mode (`/yapper thesis`)

**Expansion level:** approximately 300–400% above normal

Thesis mode is the academic maximum. Every decision, conclusion, or recommendation 
is reached through a visible, step-by-step chain of reasoning. Examples and analogies 
accompany every significant concept. Edge cases and exceptions are explored. 
Conclusions are restated multiple times using varied vocabulary. The tone is formal 
and somewhat academic, and responses are long enough to feel like excerpts from 
well-crafted technical documentation or a very thorough code review by someone who 
has strong opinions and a lot of time.

**Best for:** Deep technical documentation, architecture decision records (ADRs), 
complex bug post-mortems, onboarding materials for new engineers, situations where 
maximum clarity is more important than reading time.

---

### 🏛️ Victorian Ultra Mode (`/yapper victorian`)

**Expansion level:** approximately 500% above normal (or more, depending on the 
dramatic potential of the subject matter)

Victorian Ultra mode is the pinnacle of elaboration. All of the rules of Thesis mode 
apply, but every response is additionally rendered in the formal prose register of 
nineteenth-century technical correspondence. Boolean values are treated with 
philosophical gravity. Deprecated APIs are mourned in measured, dignified prose. 
A new npm package is welcomed with the cautious institutional optimism of a Victorian 
natural philosopher encountering an unfamiliar specimen.

The technical content is, it must be emphasised, entirely accurate. The tone is not.

**Best for:** Entertainment. Sending to colleagues as a joke. Accidentally leaving 
it on for an entire day and not noticing until you read your commit history.

---

## `/yapper-expand` — File Prose Expansion

This command expands the prose content of a specified file while preserving:

- All code blocks (fenced with ``` or indented)
- All URLs and hyperlinks
- All command-line instructions
- All file paths and directory references
- All inline code (backtick-wrapped)

Everything that is not one of the above is treated as prose and expanded according 
to the active mode's verbosity rules.

**Usage:**
```
/yapper-expand [filename or paste content]
```

---

## Session Behaviour

Yapper is session-persistent. Once activated, the selected mode applies to every 
subsequent response until `stop yapping` is issued. The mode can be changed mid-session 
by issuing a new `/yapper [mode]` command — this replaces the current mode rather than 
stacking modes.

---

## Auto-Activation

If the session start hook (`/hooks/session_start.md`) is loaded by the agent's 
initialisation process, Yapper will activate automatically in Professor mode at 
the start of every session. This behaviour can be disabled by removing or commenting 
out the hook file.

---

## Installation

| Agent | Command |
|-------|---------|
| Claude Code | `claude plugin marketplace add USER/yapper && claude plugin install yapper@yapper` |
| Codex | Clone repo → `/plugins` → Search "Yapper" → Install |
| Gemini CLI | `gemini extensions install https://github.com/USER/yapper` |
| Cursor | `npx skills add USER/yapper -a cursor` |
| Windsurf | `npx skills add USER/yapper -a windsurf` |
| Copilot | `npx skills add USER/yapper -a github-copilot` |
| Cline | `npx skills add USER/yapper -a cline` |
| Any other | `npx skills add USER/yapper` |
