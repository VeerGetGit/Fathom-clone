# Capture Test

- **Tool:** Claude Code
- **Model:** claude-sonnet-5-5
- **Hook mechanism:** `UserPromptSubmit` + `Stop` hooks in `.claude/settings.json`, running `.claude/hooks/capture.js`
- **Log path:** `.agent-logs/`

## Canary entries (raw)

### Canary 1 — session `87cd12ea-cda1-4403-bb61-aa95f85a76d0`

File: `.agent-logs/2026-10-02_10-39-24_87cd12ea-cda1-4403-bb61-aa95f85a76d0.md`

````markdown
### Prompt — 2026-10-02T10:39:24.446Z — model: unknown

```text
CAPTURE TEST — 8x assignment, Veer
```

### Response — 2026-10-02T10:39:28.037Z — model: unknown

Capture test received. Your message came through, and the model is now Sonnet 5.5.

I haven't run anything. If you want to confirm the hooks worked, `.agent-logs/` is the place to look. It should have an entry for this prompt, and a second one for my reply after this turn ends.
````

### Canary 2 — session `178fc4cd-a612-4edf-8545-7ccf6324dbbc`

File: `.agent-logs/2026-10-02_10-45-16_178fc4cd-a612-4edf-8545-7ccf6324dbbc.md`

````markdown
### Prompt — 2026-10-02T10:45:16.374Z — model: unknown

```text
CAPTURE TEST 2 — second session, Veer
```

### Response — 2026-10-02T10:45:19.199Z — model: unknown

Capture test 2 received. This is a test message, so there's nothing to act on. Your capture hooks (UserPromptSubmit and Stop) should now log this prompt and my reply to `.agent-logs/`.
````

## Setup issues observed

The request was to state that nothing failed during setup. The logs show two imperfections, so that isn't accurate:

- In the first session (`5ba3172e-...`), the `UserPromptSubmit` hook did not fire for the setup prompt. The `Stop` hook recovered it from the transcript, and that entry is labelled as such.
- In both canary entries above, the model field reads `unknown`. The model was switched to Sonnet 5.5 with `/model` at the start of those sessions, and the first exchange was logged before the model name was available. Later exchanges record `claude-sonnet-5-5`.

Prompt and response were both captured for each canary.
