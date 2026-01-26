import { describe, expect, test } from "vitest";
import { Card } from "../../../src/core/cataloging/Card.js";
import { Deck } from "../../../src/core/cataloging/Deck.js";

describe("Deck", () => {
	test("contains cards", () => {
		const card1 = new Card("Q1?", "A1");
		const deck = new Deck(card1);
		expect(deck.cards).toEqual([card1]);
	});

	test("can be iterated over for studying", () => {
		const card1 = new Card("Q1?", "A1");
		const card2 = new Card("Q2?", "A2");
		const deck = new Deck(card1, card2);
		expect([...deck]).toEqual([card1, card2]);
	});

	test("can be empty", () => {
		const deck = new Deck();
		expect([...deck]).toEqual([]);
	});
});
