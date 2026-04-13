# /yapper-commit Command

## Description

The `/yapper-commit` command generates a verbose, fully-explained Git commit message 
for the current change or a described change. The resulting commit message explains 
not just *what* changed, but *why* it changed, *what problem it solves*, and *how 
the solution works* — providing maximum context for future readers of the git history.

## Usage

```
/yapper-commit                          Generate a verbose commit for staged changes
/yapper-commit [description]            Generate a verbose commit for described change
/yapper-commit --diff [paste diff]      Generate a verbose commit from a pasted diff
```

## Output Format

The generated commit message MUST follow this structure:

```
<type>(<scope>): <concise subject line — max 72 characters>

<Body paragraph 1: What changed and at a high level, why.>

<Body paragraph 2: Technical explanation of how the change works.>

<Body paragraph 3: Why this approach was chosen over alternatives, if applicable.>

<Body paragraph 4: Any notable side effects, caveats, or follow-up work required.>

Resolves: #<issue number if known>
Tested: <brief description of how this was tested>
```

## Rules

1. The subject line must be concise (under 72 characters) and use the conventional 
   commits format: `type(scope): description`

2. The body must contain at least two full paragraphs of prose explanation

3. The *what* and the *why* must both be addressed explicitly

4. If the change fixes a bug, the root cause of the bug must be described

5. If the change adds a feature, the use case must be described

6. Technical terms used in the body should be briefly explained if they are not 
   universally understood

7. The tone should be professional but direct — future engineers reading this 
   commit deserve clarity, not poetry (unlike Victorian mode)

## Example

**Input:** "Fixed a bug where users were getting logged out randomly"

**Output:**
```
fix(auth): resolve intermittent session expiry caused by stale token cache

This commit addresses a race condition in the session management layer that was
causing authenticated users to be unexpectedly logged out, particularly under
conditions of concurrent API requests. The root cause was that the token validity
check was reading from a cached expiry timestamp rather than evaluating the live
token, meaning that if the token was silently refreshed by a parallel request,
the cached timestamp would still reflect the old (now-invalid) expiry value and
incorrectly trigger the logout flow.

The fix replaces the cached timestamp lookup with a direct evaluation of the
decoded JWT (JSON Web Token — a self-contained, base64-encoded credential that
includes its own expiry claim) on every auth check. This ensures that the expiry
evaluation always reflects the most current token state, regardless of whether
a refresh has occurred on a parallel execution path.

This approach was preferred over a mutex-based lock on the token cache because it
eliminates the cache dependency entirely rather than merely serialising access to
a fundamentally stale data source. The performance impact is negligible: JWT
decoding is a synchronous O(1) operation with no I/O.

Developers integrating with this auth module should note that the token cache has
been removed entirely in this change. Any code reading directly from the cache
(outside of the standard auth middleware) will need to be updated to use the new
`getActiveToken()` utility function introduced in this commit.

Resolves: #412
Tested: Manual session testing across Chrome, Firefox, Safari; concurrent request
simulation using the auth stress test suite in /tests/auth/concurrent.test.ts
```
