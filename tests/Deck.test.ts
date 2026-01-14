import { describe, expect, test } from "vitest";
import { Card } from "../src/Card.js";
import { Deck } from "../src/Deck.js";
import { Schedule } from "../src/Schedule.js";
import { ScheduledCard } from "../src/ScheduledCard.js";

describe("Deck", () => {
	test("contains cards", () => {
		const card1 = new ScheduledCard(new Card("Q1?", "A1"), Schedule.forNewCard());
		const deck = new Deck(card1);
		expect(deck.cards).toEqual([card1]);
	});

	test("can be iterated over for studying", () => {
		const card1 = new ScheduledCard(new Card("Q1?", "A1"), Schedule.forNewCard());
		const card2 = new ScheduledCard(new Card("Q2?", "A2"), Schedule.forNewCard());
		const deck = new Deck(card1, card2);
		expect([...deck]).toEqual([card1, card2]);
	});

	test("can be empty", () => {
		const deck = new Deck();
		expect([...deck]).toEqual([]);
	});
});
