import { describe, expect, test } from "vitest";
import type { Card } from "../../../src/core/cataloging/Card.js";
import { Deck } from "../../../src/core/cataloging/Deck.js";
import { CardBuilder } from "./CardBuilder.js";

describe("Deck", () => {
	test("contains cards", () => {
		const card1 = new CardBuilder().build();
		const deck = new Deck(card1);
		expect(deck.cards).toEqual([card1]);
	});

	test("can be iterated over for studying", () => {
		const card1 = new CardBuilder().build();
		const card2 = new CardBuilder().build();
		const deck = new Deck(card1, card2);
		expect([...deck]).toEqual([card1, card2]);
	});

	test("can be empty", () => {
		const deck = new Deck();
		expect([...deck]).toEqual([]);
	});

	test("can be merged with another deck", () => {
		const card1 = new CardBuilder().build();
		const card2 = new CardBuilder().build();
		const deck1 = new Deck(card1);
		const deck2 = new Deck(card2);

		const mergedDeck = deck1.mergeWith(deck2);

		expect([...mergedDeck]).toEqual([card1, card2]);
	});

	test("cards that are due for review can be retrieved", () => {
		const reviewedCard: Card = new CardBuilder().notDueForReview().build();
		const dueCard: Card = new CardBuilder().dueForReview().build();

		const deck = new Deck(reviewedCard, dueCard);
		const deckToReview: Deck = deck.cardsDueForReview();

		expect([...deckToReview]).toEqual([dueCard]);
	});

	test("cards that are not due for review can be retrieved", () => {
		const reviewedCard: Card = new CardBuilder().notDueForReview().build();
		const dueCard: Card = new CardBuilder().dueForReview().build();

		const deck = new Deck(reviewedCard, dueCard);
		const deckToReview: Deck = deck.cardsNotDueForReview();

		expect([...deckToReview]).toEqual([reviewedCard]);
	});
});
