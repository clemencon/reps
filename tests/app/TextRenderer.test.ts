import dedent from "dedent";
import { describe, expect, test } from "vitest";
import { renderTopicTree } from "../../src/app/TextRenderer.js";
import { DeckBuilder } from "../core/cataloging/DeckBuilder.js";
import { TopicBuilder } from "../core/cataloging/TopicBuilder.js";

describe("TextRenderer", () => {
	test("creates a text representation of a topic tree", () => {
		const refactoring = new TopicBuilder()
			.withName("refactoring")
			.withDeck(new DeckBuilder().withCardsNotDue(1).build())
			.build();
		const errorHandling = new TopicBuilder()
			.withName("error-handling")
			.withDeck(new DeckBuilder().withCardsDue(3).build())
			.build();
		const cleanCode = new TopicBuilder()
			.withName("clean-code")
			.withDeck(new DeckBuilder().withCardsDue(3).build());

		const catalog = new TopicBuilder()
			.withName("catalog")
			.withDeck(new DeckBuilder().withCardsNotDue(1).build())
			.withSubtopics(cleanCode.withSubtopics(refactoring).build(), errorHandling)
			.build();

		const renderedTopicTree = renderTopicTree(catalog);

		expect(renderedTopicTree).toBe(dedent`
		   catalog (8 cards: 6 due)
		   ├── clean-code (4 cards: 3 due)
		   │   └── refactoring (1 card: done)
		   └── error-handling (3 cards: 3 due)
		`);
	});
});
