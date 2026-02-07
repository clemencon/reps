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

	test("shuffling an empty deck returns an empty deck", () => {
		const deck = new Deck();
		const shuffledDeck = deck.shuffle();
		expect(shuffledDeck.amountOfCards).toEqual(0);
	});

	test("shuffling a single-card deck returns a deck with that card", () => {
		const card = new CardBuilder().build();
		const deck = new Deck(card);
		const shuffledDeck = deck.shuffle();
		expect([...shuffledDeck]).toEqual([card]);
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

	// ju: Use the deck builder with enough cards, 1/n!.
	test("can be shuffled", () => {
		const card1 = new CardBuilder().build();
		const card2 = new CardBuilder().build();
		const card3 = new CardBuilder().build();
		const card4 = new CardBuilder().build();
		const card5 = new CardBuilder().build();
		const deck = new Deck(card1, card2, card3, card4, card5);

		const shuffledDeck = deck.shuffle();

		expect([...shuffledDeck]).not.toEqual([card1, card2, card3, card4, card5]);
		expect(shuffledDeck.amountOfCards).toEqual(deck.amountOfCards);
		expect([...shuffledDeck]).toEqual(expect.arrayContaining([card1, card2, card3, card4, card5]));
	});

	test("can't be shuffled with less than 2 cards", () => {
		const card = new CardBuilder().build();
		const deck = new Deck(card);

		const shuffledDeck = deck.shuffle();

		expect([...shuffledDeck]).toEqual([card]);
	});
});
