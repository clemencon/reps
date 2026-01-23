import type { Card } from "./Card.js";

export class Deck {
	public readonly cards: ReadonlyArray<Card>;

	public constructor(...cards: Card[]) {
		this.cards = cards;
	}

	public [Symbol.iterator](): Iterator<Card> {
		return this.cards[Symbol.iterator]();
	}
}
