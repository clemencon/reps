import { describe, expect, test } from "vitest";
import { Card } from "../../../src/core/cataloging/Card.js";
import { Deck } from "../../../src/core/cataloging/Deck.js";
import { Topic } from "../../../src/core/cataloging/Topic.js";

describe("Topic", () => {
	test("organizes cards under a named subject", () => {
		const card = new Card("What is 2+2?", "4");
		const deck = new Deck(card);
		const topic = new Topic("Arithmetic", deck);

		expect(topic.name).toBe("Arithmetic");
		expect(topic.deck).toBe(deck);
	});

	test("can contain subtopics", () => {
		const additionCard = new Card("1+1?", "2");
		const addition = new Topic("Addition", new Deck(additionCard));
		const subtractionCard = new Card("3-1?", "2");
		const subtraction = new Topic("Subtraction", new Deck(subtractionCard));
		const math = new Topic("Math", new Deck(), [addition, subtraction]);

		expect(math.containsSubtopics).toBe(true);
		expect(math.subtopics).toEqual([addition, subtraction]);
	});

	test("defaults to no subtopics when none are provided", () => {
		const topic = new Topic("Standalone", new Deck());
		expect(topic.containsSubtopics).toBe(false);
	});
});
