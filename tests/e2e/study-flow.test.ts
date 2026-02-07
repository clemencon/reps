import dedent from "dedent";
import { describe, test } from "vitest";

describe.todo("Study flow", () => {
	// ju: Add a help option: reps --help.
	// ju: Add an initialization message.
	// Initialized successfully.
	// Your catalog is empty. Add some cards to get started.
	// You can find your catalog at: /Users/clemencon/reps/.

	test("prompts the user to pick a topic to review", async () => {
		dedent`
			Let's go, here is your topic tree:

			reps (6 cards: 6 due)
			├── clean-code (3 cards: 3 due)
			│   └── refactoring (1 card: 1 due)
			└── error-handling (3 cards: 3 due)

			Pick a topic to review.
		`;
	});
});
