import { describe, expect, test } from "vitest";
import { Card } from "../../src/core/Card.js";
import { Deck } from "../../src/core/Deck.js";
import { Schedule } from "../../src/core/Schedule.js";
import { ScheduledCard } from "../../src/core/ScheduledCard.js";
import { Topic } from "../../src/core/Topic.js";

describe("Topic", () => {
	test("organizes cards under a named subject", () => {
		const card = new ScheduledCard(new Card("What is 2+2?", "4"), Schedule.forNewCard());
		const deck = new Deck(card);
		const topic = new Topic("Arithmetic", deck);

		expect(topic.name).toBe("Arithmetic");
		expect(topic.cards).toBe(deck);
	});

	test("can contain subtopics", () => {
		const additionCard = ScheduledCard.fromUnreviewed(new Card("1+1?", "2"));
		const addition = new Topic("Addition", new Deck(additionCard));
		const subtractionCard = ScheduledCard.fromUnreviewed(new Card("3-1?", "2"));
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
