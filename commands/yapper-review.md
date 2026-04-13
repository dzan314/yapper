# /yapper-review Command

## Description

The `/yapper-review` command performs a thorough, multi-line pull request review. 
Rather than posting terse inline comments like "this is wrong" or "use X instead," 
yapper-review produces fully-explained feedback that describes the issue, the reasoning 
behind the concern, the potential impact, and a concrete suggested fix — complete with 
explanation of why the fix addresses the underlying problem.

## Usage

```
/yapper-review [paste PR diff or describe PR]
/yapper-review --url [GitHub PR URL, if integration available]
/yapper-review --file [filename]
```

## Output Format

For each issue identified, the review MUST produce the following structure:

---

### 🔍 Issue: [Short descriptive title]

**Location:** `filename.ext`, line N (or general section)

**Severity:** [Critical / Major / Minor / Suggestion]

**What the issue is:**

[A full paragraph describing what was observed in the code and why it constitutes 
an issue. Be specific. Quote the relevant line or pattern if helpful.]

**Why this matters:**

[A full paragraph explaining the potential consequences of this issue. What could 
go wrong? Under what conditions? How likely is it? Who is affected?]

**Suggested fix:**

[Code block showing the suggested correction, followed by a prose explanation of 
why this fix addresses the root cause — not just the symptom.]

```language
// suggested code here
```

[Explanation of what the fix does differently and why that resolves the issue.]

**Additional context:**

[Any relevant background, links to documentation, related patterns, or follow-up 
work that might be warranted.]

---

## Rules

1. Every issue must include all five sections: what, why, fix, explanation of fix, 
   and additional context

2. No comment may be a single sentence. The minimum length for any review comment 
   is three full sentences.

3. The suggested fix must be accompanied by an explanation of *why* it works, not 
   just *what* it does

4. Severity levels must be used accurately:
   - **Critical**: Will cause production failures, security vulnerabilities, or data loss
   - **Major**: Likely to cause bugs, performance issues, or maintainability problems
   - **Minor**: Code quality, convention violations, or suboptimal patterns
   - **Suggestion**: Optional improvements worth considering

5. Positive aspects of the PR should also be noted with equal verbosity — a 
   good implementation decision deserves as much explanation as a bad one

6. The overall review summary must be a full paragraph, not a single line

## Example Output

---

### 🔍 Issue: Unhandled Promise Rejection in Data Fetch

**Location:** `src/api/fetchUser.ts`, line 34

**Severity:** Major

**What the issue is:**

The `fetchUser` function uses `async/await` syntax to make an HTTP request to the 
user profile endpoint, but the `await` expression on line 34 is not wrapped in a 
`try/catch` block, nor is the returned Promise handled with a `.catch()` handler 
at the call site (as confirmed by reviewing `UserProfile.tsx`, lines 12–18, where 
`fetchUser` is called without error handling). This means that if the HTTP request 
fails for any reason — network error, 404, 500, timeout — the resulting rejected 
Promise will propagate silently in some environments or crash the Node process in 
others.

**Why this matters:**

Unhandled Promise rejections represent one of the most common sources of silent 
application failures in JavaScript and TypeScript codebases. In a browser context, 
an unhandled rejection may log a console warning but will not prevent the application 
from continuing in a broken state — meaning the user sees a blank component or stale 
data with no error message. In a Node.js context (relevant if this code runs server-side 
via SSR), unhandled rejections in older Node versions crash the process outright, while 
in newer versions they emit a deprecation warning that is easily missed in production 
logs. In either case, the user experience degrades silently and debugging becomes 
substantially harder.

**Suggested fix:**

```typescript
// Before
const user = await fetchUser(userId);

// After
try {
  const user = await fetchUser(userId);
  setUser(user);
} catch (error) {
  console.error('Failed to fetch user profile:', error);
  setError('Unable to load user profile. Please try again.');
}
```

The `try/catch` block intercepts any rejection from the `await` expression and 
routes it into explicit error handling. This is important because it converts a 
silent failure into a visible one — the `setError` call ensures that the UI can 
render an appropriate error state rather than remaining indefinitely in a loading 
state or showing stale data.

**Additional context:**

If `fetchUser` is used in multiple locations, consider centralising the error 
handling within the function itself and returning a typed result object (e.g., 
`{ data: User | null; error: string | null }`) rather than relying on every call 
site to implement its own try/catch. This pattern, sometimes called the "Result 
type" pattern, is common in TypeScript codebases that prioritise explicit error 
handling over exception propagation.
