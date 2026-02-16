# Todo

## Study Flow

- [ ] After finishing a deck, return to topic selection.
- [ ] Exclude topics with no cards due from the selection prompt.
- [ ] Skip a card and advance to the next.
- [ ] After each deck, show cards reviewed and grade distribution.
- [ ] Add a progress indicator (e.g., "Card 3/12").

## Graceful Shutdown

- [ ] On Escape during any prompt, confirm quit and throw StudySessionAborted.
- [ ] Catch StudySessionAborted in main.ts and exit with code 0.

## Error Handling

- [ ] Show a user-facing error (not a stack trace) for malformed card files (missing `???` separator).
- [ ] Show a user-facing error (not a stack trace) for malformed config (invalid JSON).

## Onboarding

- [ ] On first launch, display a welcome banner and keyboard shortcuts.
- [ ] Add a `--help` flag showing usage and the catalog directory path.
- [ ] Show inline hints in prompts (e.g., "Press Ctrl+C to quit" or "Type to filter topics").

## Suggestions

- [ ] Support `???`-delimited multi-card files.
