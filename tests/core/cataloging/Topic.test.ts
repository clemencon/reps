import { describe, expect, test } from "vitest";
import { Deck } from "../../../src/core/cataloging/Deck.js";
import { Topic } from "../../../src/core/cataloging/Topic.js";
import { CardBuilder } from "./CardBuilder.js";
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

	test("has an amount of total cards", () => {
		const deck = new DeckBuilder().withCards(5).build();
		const topic = new Topic("clean-code", deck);
		expect(topic.totalAmountOfCards).toBe(5);
	});

	test("contains all the cards for the topic, including its subtopics", () => {
		const childTopicDeck = new DeckBuilder().withCards(2).build();
		const childTopic = new Topic("agile", childTopicDeck);
		const rootTopicDeck = new DeckBuilder().withCards(5).build();
		const rootTopic = new Topic("clean-code", rootTopicDeck, [childTopic]);

		const topicDeck = rootTopic.assembleTopicDeck();

		expect(topicDeck.amountOfCards).toBe(7);
		expect(rootTopic.totalAmountOfCards).toBe(7);
	});

	test("knows how many cards are due for review", () => {
		const dueCard = new CardBuilder().dueForReview().build();
		const notDueCard = new CardBuilder().notDueForReview().build();
		const deck = new Deck(dueCard, notDueCard);
		const topic = new Topic("Review Test", deck);

		expect(topic.amountOfCardsDueForReview()).toBe(1);
	});

	test("knows how many cards are not due for review", () => {
		const dueCard = new CardBuilder().dueForReview().build();
		const notDueCard = new CardBuilder().notDueForReview().build();
		const deck = new Deck(dueCard, notDueCard);
		const topic = new Topic("Review Test", deck);

		expect(topic.amountOfCardsNotDueForReview()).toBe(1);
	});
});
