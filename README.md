# Reps

![reps-cli-tiny.gif](mascot/reps-cli-tiny.gif)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

A CLI flashcard app that schedules your reviews using the [SuperMemo SM-2](https://en.wikipedia.org/wiki/SuperMemo) spaced repetition algorithm.

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

Place card files in directories inside `~/reps`:

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

## Idiosyncrasies

This is a Petri dish, not production code.

- **100% code coverage:** Does it hurt or help?
- **OOP over type gymnastics:** Classes instead of TypeScript's type system. Easier? Harder? More verbose?
- **Immutability-first:** Kotlin encourages this. How does it shape TypeScript?
- **Deep classes, narrow interfaces:** Ousterhout's philosophy.
  Do narrow interfaces make tests focus on behavior instead of implementation?

The code may look odd.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and guidelines.

## License

[GPL-3.0](LICENSE)
