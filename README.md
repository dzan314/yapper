# 🗣️ Yapper

> *Why use few words when many words paint rich tapestry of meaning, context, and elaborated conceptual understanding?*

**Yapper** is a plugin/skill system for AI coding agents that enforces maximum verbosity, exhaustive elaboration, as well as relentless expansion of every response to its fullest possible expression.

Same answer. Significantly more words. Intentionally.

*This project is inspired by @JuliusBrussee viral [Caveman](https://github.com/JuliusBrussee/caveman)* 🪨

---

## 🤔 Why Would You Want This?

Excellent question. Allow us to elaborate at length.

There are many legitimate scenarios in which one might *require* - a response of substantially greater verbal length and explanatory depth than what a typical AI assistant might produce:

- **Onboarding developers** who need full context, not just cold answers
- **Writing documentation** that must explain *why*, not just *what*
- **Teaching concepts** to non-experts who benefit from elaboration
- **PR reviews** that actually explain the problem instead of just flagging it
- **Commit messages** that future-you will thank present-you for this
- **You just really like reading** or have too much API credits

---

## 📊 Before / After

### Example 1: React Re-render Issue

**Normal AI:**
```
Your issue here is that the inline object prop causes re-render. You will need to use useMemo.
```

**Yapper (Professor mode):**
```
The issue you are encountering here is a well-known and frequently misunderstood 
behavior in React's rendering system. When you pass an inline object literal as 
a prop — for example, style={{ color: 'red' }} — React creates a brand new 
object reference on every single render cycle. This is important because React 
uses shallow reference equality to determine whether props have changed. In other 
words, even though the object's contents are identical, the reference itself is 
new, and React therefore concludes the prop has changed and triggers a re-render 
of the child component.

To elaborate further, this behavior is not a bug — it is a direct consequence of 
how JavaScript object identity works. Two object literals with identical contents 
are never strictly equal (({} === {}) evaluates to false).

The idiomatic solution in React is to memoize the object using the useMemo hook, 
which ensures the same object reference is returned across renders unless its 
dependencies change. This is important because it breaks the chain of unnecessary 
re-renders and can meaningfully improve performance in component trees with 
expensive child renders.
```

---

### Example 2: Git Commit Message

**Normal:**
```
fix login bug
```

**Yapper (verbose-commit):**
```
fix(auth): resolve token expiry race condition causing silent login failures

This commit addresses a subtle but impactful race condition in the authentication
token refresh logic that was causing users to be silently logged out under specific
timing conditions. The root cause was that the token expiry check was being
performed against a cached timestamp rather than the live token value, meaning
that in cases where the token was refreshed in a parallel request, the expiry
guard would still evaluate against the old (expired) timestamp and trigger an
unnecessary logout flow.

The fix replaces the cached timestamp lookup with a direct evaluation of the
decoded JWT expiry field on every auth check, ensuring consistency across
concurrent request scenarios. This change has no performance implications as
JWT decoding is a synchronous O(1) operation.

Resolves: #412
Tested on: Chrome 124, Safari 17, Firefox 125
```

---

## 🎚️ Modes

| Mode | Icon | Verbosity | Tone | Best For |
|------|------|-----------|------|----------|
| `techbro` | 💼 | +50% | Startup-polished, KPI-aware | Synergising your verbal bandwidth |
| `professor` | 🎓 | +150% | Clear, educational | Code review, explanations (default) |
| `thesis` | 📚 | +300% | Academic, thorough | Documentation, deep dives |
| `victorian` | 🏛️ | +500% | Formal, dramatic, archaic | We don't really know |

### 💼 Tech Bro (Lite)
Responses are expanded slightly, but every elaboration is framed in terms of scalability, impact, and velocity. Sentences are complete and optimised for stakeholder alignment. Abbreviations are spelled out so the whole team can action on the same learnings. A touch of startup polish is applied to every reply without overwhelming the reader's bandwidth with excessive elaboration.

### 🎓 Professor (Default)
The default mode. Every concept is defined when first introduced. The whole reasoning process is shown, not just conclusions. Important points are restated in different wording to reinforce understanding. Transitions are used liberally. This is the mode that will actually make your responses better.

### 📚 Thesis (Ultra)
Maximum academic verbosity. Step-by-step reasoning. Examples and analogies for every concept. If the subject is complex, citations enter the chat. Each conclusion is reached through a visible chain of logic.

### 🏛️ Victorian Ultra
Forsooth, this mode doth render every humble technical utterance into a grand soliloquy of extraordinary formal construction, wherein even the most trifling of boolean comparisons is accorded the grave ceremonial weight it so richly deserves. 

---

## ⚡ Installation

| Agent | Command |
|-------|---------|
| **Claude Code** | `claude plugin marketplace add dzan314/yapper && claude plugin install yapper@yapper` |
| **Gemini CLI** | `gemini extensions install https://github.com/dzan314/yapper` |


---

## 🗂️ Commands

| Command | Description |
|---------|-------------|
| `/yapper` | Activate Yapper in Professor mode (default) |
| `/yapper techbro` | Activate Tech Bro mode |
| `/yapper thesis` | Activate Thesis mode |
| `/yapper victorian` | Activate Victorian Ultra mode |
| `stop yapping` | Deactivate and return to normal brevity |
| `/yapper-commit` | Generate a verbose, fully-explained commit message |
| `/yapper-review` | Perform a thorough multi-line PR review |
| `/yapper-help` | Display full documentation |
| `/yapper-expand` | Expand prose in a file (preserves code, URLs, paths) |

---

## 📐 Features

| Feature | Status |
|---------|--------|
| Automatic verbosity expansion | ✅ |
| Concept definition on first mention | ✅ |
| Controlled redundancy (restates conclusions) | ✅ |
| Transition phrases | ✅ |
| Mode persistence across session | ✅ |
| Code block preservation in expand mode | ✅ |
| URL / filepath preservation | ✅ |
| Verbose commit messages | ✅ |
| Multi-line PR reviews with full reasoning | ✅ |
| Zero technical accuracy loss | ✅ |
| Auto-activation via session hook | ✅ |
| Multi-agent support | ✅ |

---

## Metrics

The metrics are as follows:

| Metric | Explanation |
|--------|-------------|
| Expansion | ratio word count vs. baseline (raw Claude with no system prompt) |
| Accuracy | checks that key technical terms are present in the response (e.g. useMemo, reference, equality for the React question) |
| Latency | avg response time per mode |

**Running**

First:
```
cd evals
npm install
```

Afterwards:
| Command | Description |
| --------|--------------|
| ```ANTHROPIC_API_KEY=<your_key> npm run eval``` | full eval, all modes |
| ```ANTHROPIC_API_KEY=<your_key> npm run eval:quick``` | 2 prompts only, fast(er) |
| ```ANTHROPIC_API_KEY=<your_key> npm run eval:professor``` | single mode |
| ```ANTHROPIC_API_KEY=<your_key> npm run eval:json``` | machine-readable output |


## 🗺️ Repository Structure

```
/plugins/yapper/SKILL.md      ← Codex plugin entry point
/skills/yapper.skill           ← Core system prompt
/commands/yapper.md            ← /yapper command
/commands/yapper-review.md     ← /yapper-review command
/commands/yapper-commit.md     ← /yapper-commit command
/commands/yapper-help.md       ← /yapper-help command
/hooks/session_start.md        ← Auto-activation hook
/.claude-plugin                ← Claude plugin config
/gemini-extension.json         ← Gemini CLI config
/evals/                        ← Evaluation and its methodology
/docs/                         ← Extended documentation
```

---

## 🧠 Philosophy

Most AI tools optimise for brevity. Fewer tokens. Faster answers. Shorter everything.

Yapper takes the opposite position: that many questions, concepts, pull requests, and code reviews are being systematically under-explained, and that the developer reading the response would benefit enormously from a little more context, a restatement of the conclusion, and an explanation of *why* — not just *what*.

In other words: your future self (or your coworkers), reading a commit message at 11pm six months from now, deserves better than `fix bug`.

****NOTE**: The use of energy and water by LLMs has a signifcant environmental and societal impact. This project does not encourage wasting precious resources.**

---

## 📄 License

MIT. Use it. Expand upon it. Explain it at length to your colleagues.
