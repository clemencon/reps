# Reps

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

A CLI flashcard app using the SuperMemo SM-2 spaced repetition algorithm.
Simplicity first.

## Study Flow

When you run `reps`, you see a topic tree showing cards due for review:

```
$ reps

4 out of 7 cards are ready to be reviewed.

library (4/7 cards due)
├── clean-code (1/3 cards due)
│   └── refactoring (1/1 done)
└── error-handling (3/3 cards due)

Pick a topic to review: clean-code
```

**Review Process:**

1. Choose a topic from the tree
2. Answer the question, reveal the answer
3. Grade your recall to schedule the next review
4. Continue until you finish all cards in the topic
5. Return to the topic tree or finish if no cards remain

## Core Concepts

### Card

A flashcard with a question and answer, stored as a plain text file separated by `???`.

**Format:**

```txt
What is the capital of France?
???
Paris.
```

**Key Points:**

- One card per file
- Format: question, then `???`, then answer
- Content can be text, code, formulas, anything
- File names are descriptive but don't affect functionality
- Progress tracks performance and schedules the next review

### Topic

A subject category that groups related cards. Each topic is a directory in your library.

**Characteristics:**

- Contains cards (files in the directory)
- Can have subtopics (subdirectories)
- Cards inherit their parent topic's hierarchy
- Names are descriptive and logically organized

### Library

Your complete collection of study material—the root directory containing all topics and cards.

**Structure Example:**

```
library/
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

### Deck

A collection of cards assembled for study.

**Types:**

- Topic Deck: All cards from a topic and its subtopics
- Review Deck: Only cards due for review based on the spaced repetition algorithm

### Student

You. The student:

- Selects topics to study
- Reviews cards and self-evaluates answers
- Assigns review grades based on recall
- Progresses through review sessions

### Topic Tree

**Structure:**

- Root: The library directory containing all top-level topics
- Topic: A subject area containing:
  - Multiple subtopics
  - One deck with all cards for that topic

### Progress

Reps' memory system.
It tracks your performance with each card, records retention grades,
calculates when to review each card next using SM-2,
and schedules cards based on performance: better recall means longer intervals.

### Spaced Repetition (SM-2 Algorithm)

Reps uses the SuperMemo SM-2 algorithm to optimize review timing.
Cards you struggle with appear more frequently.
Cards you master appear less often.
Review intervals increase exponentially for well-remembered cards.

## Architecture

- Cards and Topics: Plain text files in the filesystem (not in database)
- Progress: SQLite database tracking performance and review schedules
- Card Identification: SHA-1 hash of text file content

This hybrid approach keeps study material editable as plain text while maintaining performance data in a structured database.

## Development

- Domain-driven design with clear ubiquitous language
- TDD, focusing on functionality over implementation

```bash
# Build for production.
pnpm build

# Run linter/formatter with auto-fix.
pnpm fix

# Run the tests (including the snapshot tests).
pnpm test

# Review the diff first to verify changes are correct.

# Update snapshot after reviewing changes.

```

## Stack

- [Node.js 24.12.0 ](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/motivation)
- [vitest](https://vitest.dev/guide/)
- [Biome](https://biomejs.dev/guides/getting-started/)
- [Ink](https://github.com/vadimdemedes/ink?tab=readme-ov-file#getting-started)
