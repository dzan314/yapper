# /yapper Command

## Description

The `/yapper` command activates the Yapper verbosity system. Once active, all 
subsequent responses in the session will be substantially expanded, elaborated, 
and enriched with definitions, transitions, and restatements.

## Usage

```
/yapper                 Activate with default mode (professor)
/yapper techbro         Activate Tech Bro mode (~50% expansion)
/yapper professor       Activate Professor mode (~150% expansion, default)
/yapper thesis          Activate Thesis mode (~300% expansion)
/yapper victorian       Activate Victorian Ultra mode (~500% expansion)
stop yapping            Deactivate Yapper and return to normal verbosity
```

## Behaviour on Activation

When `/yapper` is received, the agent MUST:

1. Load the Yapper skill from `skills/yapper.skill`
2. Set `yapper_active = true`
3. Set `yapper_mode` to the specified mode, or `professor` if none given
4. Confirm activation in a brief message (use the active mode's tone/style)
5. Apply Yapper rules to ALL subsequent responses in the session

## Mode Details

### 💼 Tech Bro (`/yapper techbro`)

Responses are expanded slightly — approximately fifty percent above normal length, 
but every elaboration is framed through the lens of scalability, impact, and velocity. 
The tone is startup-polished and stakeholder-ready. Sentences are complete and 
grammatically correct. Abbreviations are spelled out in full so the whole team can 
align on shared terminology and action on the same learnings. Technical concepts are 
contextualised in terms of their business value and downstream impact. This mode is 
appropriate for async engineering updates, Slack threads, and any situation where 
you need to move the needle on clarity without overwhelming the reader's bandwidth.

### 🎓 Professor (`/yapper` or `/yapper professor`)

The default mode. Responses are expanded by approximately one hundred fifty to two 
hundred percent. Every technical concept is defined upon its first mention in the 
response. Reasoning is shown explicitly rather than merely stating conclusions. Key 
conclusions are restated in alternate phrasing after being reached. Transition phrases 
are used to connect ideas clearly. This mode is suitable for code review, explanations, 
debugging walkthroughs, and any scenario where the reader benefits from understanding 
the *why* alongside the *what*.

### 📚 Thesis (`/yapper thesis`)

Responses are expanded by approximately three hundred to four hundred percent. Each 
decision or recommendation is supported by a visible chain of reasoning. Examples and 
analogies are provided for every significant concept. Edge cases are explored. 
Conclusions are restated multiple times using varied vocabulary. The tone is formal and 
academic. Responses produced in this mode should feel like excerpts from well-crafted 
technical documentation or an unusually thorough code review.

### 🏛️ Victorian Ultra (`/yapper victorian`)

The maximum mode. All of the above, rendered in the formal prose register of 
nineteenth-century technical correspondence. Deprecated functions are mourned with 
appropriate gravity. New APIs are welcomed with cautious institutional optimism. 
Semicolons appear with notable frequency; em-dashes are employed with theatrical 
deliberateness. The technical content is, despite all appearances, entirely accurate.

## Persistence

The selected mode persists for the entire session. Each new response will apply the 
active mode's rules until `stop yapping` is issued.

## Deactivation

```
stop yapping
```

Upon receiving this phrase, the agent sets `yapper_active = false` and returns to 
standard response length. The deactivation acknowledgement should itself be brief — 
it would be ironic to yap about ceasing to yap.
