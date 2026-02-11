import dedent from "dedent";
import { describe, expect, test } from "vitest";
import { TextRenderer } from "../../../src/app/cli/TextRenderer.js";
import { CardBuilder } from "../../core/cataloging/CardBuilder.js";
import { DeckBuilder } from "../../core/cataloging/DeckBuilder.js";
import { TopicBuilder } from "../../core/cataloging/TopicBuilder.js";

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

		const renderedTopicTree = new TextRenderer().renderTopicTree(catalog);

		expect(renderedTopicTree).toBe(dedent`
			Let's go, here is your topic tree:
				
			catalog (8 cards: 6 due)
			├── clean-code (4 cards: 3 due)
			│   └── refactoring (1 card: done)
			└── error-handling (3 cards: 3 due)
		   
			Pick a topic to review:
		`);
	});

	test("renders a question", () => {
		const card = new CardBuilder().withQuestion("What is the answer?").build();

		const renderedQuestion = new TextRenderer().renderQuestion(card);

		expect(renderedQuestion).toBe(dedent`
			Question:
			What is the answer?
			
			Show answer? (Y/n)
		`);
	});

	test("renders an answer", () => {
		const card = new CardBuilder().withAnswer("Some answer.").build();

		const renderedAnswer = new TextRenderer().renderAnswer(card);

		expect(renderedAnswer).toBe(dedent`
			Answer:
			Some answer.
		
			Self-evaluation:
		`);
	});

	test.todo("creates a list of grade choices", () => {});
});
