# Reps

![reps-cli-tiny.gif](mascot/reps-cli-tiny.gif)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A CLI flashcard app that schedules your reviews using the [SuperMemo SM-2](https://en.wikipedia.org/wiki/SuperMemo)
spaced repetition algorithm.

## Quick Start

```
$ reps

4 out of 7 cards are ready to be reviewed.

reps (6 cards: 5 due)
├── clean-code (3 cards: 2 due)
│   └── refactoring (1 card: done)
└── error-handling (3 cards: 3 due)

Pick a topic to review.
```

## Status

A personal MVP. I built this, tried it, but I don't use it. It's not actively maintained.

If I picked this back up, I would:

- **Do performance testing:** Find where things get slow or blow up, stack overflows in deep topic trees, large catalogs.
- **Make the CLI self-discoverable:** A welcome banner on the first launch, inline hints in prompts.
- **Flesh out the study flow:** Return to topic selection after finishing a deck, skip cards, show a review summary with
  grade distribution, add a progress indicator.
- **Drop the coverage requirement:** Useful as a negative indicator, poor as a positive one.

## Installation

Requires [Node.js](https://nodejs.org/) >= 22.

With npm:

```bash
npm install -g @clemencon/reps
```

Or with pnpm:

```bash
pnpm add -g @clemencon/reps
```

## Usage

### 1. Create your cards

Cards are plain text files (`.md` or `.txt`) with question and answer separated by `???`:

```txt
What is the capital of France?
???
Paris.
```

### 2. Organize them into topics

Put cards in directories under `~/reps`:

```
~/reps/
├── clean-code/
│   ├── function-naming.txt
│   ├── single-responsibility.txt
│   └── refactoring/
│       └── code-smells.txt
└── error-handling/
    ├── define-errors-out.txt
    ├── exception-complexity.txt
    └── untested-exceptions.txt
```

### 3. Study

Run `reps` to see which cards are due for review, then:

1. Choose a topic from the tree
2. Answer the question, then reveal the answer
3. Grade your recall (0–5) to schedule the next review
4. Continue until you finish all cards in the topic
5. Return to the topic tree or finish if no cards remain

Cards you struggle with appear more frequently.
Cards you master appear less often.
Review intervals increase exponentially for well-remembered cards.

## Configuration

On first run, Reps creates a config file at `~/.config/reps.json`.

| Setting        | Default                               | Description                     |
|----------------|---------------------------------------|---------------------------------|
| `catalogPath`  | `~/reps`                              | Directory containing your cards |
| `databasePath` | `~/.local/share/reps/schedule.sqlite` | SQLite database for schedules   |

## License

[MIT](LICENSE)
