import { describe, expect, test } from "vitest";
import { Topic } from "../../../src/core/cataloging/Topic.js";
import { DeckBuilder } from "./DeckBuilder.js";

describe("Topic", () => {
	test("organizes cards under a named subject", () => {
		const deck = new DeckBuilder().withCards(3).build();

		const topic = new Topic("Arithmetic", deck);

		expect(topic.name).toBe("Arithmetic");
		expect(topic.deck).toBe(deck);
	});

	test("can contain subtopics", () => {
		const additionDeck = new DeckBuilder().withCards(2).build();
		const addition = new Topic("Addition", additionDeck);
		const subtractionDeck = new DeckBuilder().withCards(2).build();
		const subtraction = new Topic("Subtraction", subtractionDeck);

		const subtopics = [addition, subtraction];
		const mathDeck = new DeckBuilder().empty().build();
		const math = new Topic("Math", mathDeck, subtopics);

		expect(math.containsSubtopics).toBe(true);
		expect(math.subtopics).toEqual(subtopics);
	});

	test("defaults to no subtopics when none are provided", () => {
		const standaloneDeck = new DeckBuilder().empty().build();
		const topic = new Topic("Standalone", standaloneDeck);
		expect(topic.containsSubtopics).toBe(false);
	});
});
