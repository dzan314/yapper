# Yapper — Extended Documentation

## Table of Contents

1. [Philosophy](#philosophy)
2. [The Problem With Brevity](#the-problem-with-brevity)
3. [How Yapper Works](#how-yappergpt-works)
4. [Mode Selection Guide](#mode-selection-guide)
5. [Integration Patterns](#integration-patterns)
6. [Advanced Usage](#advanced-usage)
7. [One might wonder](#one-might-wonder)

---

## Philosophy

The prevailing assumption in AI tool design is that shorter is better. Fewer tokens. 
Faster responses. Compressed answers. This assumption is fully reasonable in most contexts, for example if you ask an agent what the capital of France is, you need one word, not a paragraph.

However, areas like software development are not a trivia game. Software development is a discipline 
in which context, reasoning, and explanation are often more valuable than the answer 
itself. If a developer asks "why is this re-rendering?", the one-line answer 
("inline object prop causes re-render") is obviously correct but it's practically 
shallow. The developer who receives that answer may fix the symptom 
without understanding the underlying mechanism, and will probably encounter the same class of 
bug again.

Yapper is built on the premise that the answer is necessary but not sufficient. 
The reasoning behind the answer, the context in which it applies, the mechanism by 
which the fix works, and the edge cases where it might not - these are the things 
that turn a correct answer into genuine understanding.

In other words: Yapper **does not** produce better answers. It produces the same 
answers, but surrounded by enough explanation that the reader actually learns from them.

---

## The Problem With Brevity

Consider the following common examples of under-explained AI responses in 
software development contexts:

**Code review:** `"Use early return here"` - correct, but why? What happens if you 
don't? Is it a performance issue, a readability issue, a correctness issue?

**Commit message:** `"fix auth bug"` - six months from now, what does this mean? 
Which auth bug? What caused it? What did the fix actually change?

**Debugging response:** `"Check your async/await usage"` - where? How? What are we looking for? What does incorrect usage look like versus correct usage?

In each of these cases, the response is technically not wrong. But it fails the 
reader who needs to act on it. Yapper addresses this failure mode directly.

---

## How Yapper Works

Yapper is implemented as a system-level skill that, when active, modifies the 
agent's response generation behaviour through a set of hard constraints:

1. **Length enforcement:** The skill instructs the model that any response that 
   could be elaborated further should be. The model is explicitly instructed that 
   producing a short answer when a long one is possible constitutes a failure.

2. **Definition injection:** A rule requires that every technical term, on its 
   first mention, be accompanied by a definition or explanatory clause.

3. **Reasoning visibility:** The model is instructed to show its reasoning 
   explicitly rather than stating only its conclusions.

4. **Restatement obligation:** After reaching any conclusion, the model must 
   restate it in different phrasing.

5. **Transition enforcement:** The model must connect ideas using explicit 
   transitional language from an approved list.

6. **Accuracy override:** Despite all of the above, the model must not sacrifice 
   accuracy for length. If it is unsure of a detail, it must say so - at length.

---

## Mode Selection Guide

**Use Tech Bro when:**
- You want slightly expanded responses with a startup-polish veneer
- You're writing async updates or Slack messages where context helps but brevity still matters
- You need to surface the key learnings without going too deep into the weeds
- You're new to Yapper and want to ease in without fully committing to the bit

**Use Professor when:**
- You want explanations, not just answers
- You're reviewing code and want reviewers to understand your comments
- You're writing documentation and want it to actually explain things
- You're debugging and need to understand root causes, not just symptoms
- (When in doubt, use Professor. It is the default for a reason.)

**Use Thesis when:**
- You're writing architecture decision records or technical RFCs
- You're creating onboarding documentation for new engineers
- You're writing a post-mortem and want every detail captured
- You have a lot of time and want a lot of words

**Use Victorian when:**
- You want to confuse your colleagues
- You believe that even a null pointer dereference deserves to be described with 
  the gravity and formal prose that such a treacherous event rightly merits

---

## One might wonder

**Q: Does Yapper slow down responses?**  
A: Yes. Longer responses take longer to generate. This is a deliberate tradeoff. 
If you need speed, use Tech Bro mode or disable Yapper. Or use Caveman :))

**Q: Can I use Yapper for non-code tasks?**  
A: Yes. Yapper applies to all responses, not just code. It works particularly 
well for documentation, written communication, and explanation tasks.

**Q: What happens to code blocks?**  
A: Code blocks are never expanded. Yapper only applies to prose. `/yapper-expand` 
explicitly preserves all code blocks, URLs, and file paths.

**Q: Is Victorian mode actually useful?**  
A: Define useful?
