import type { Card } from "./Card.js";

export class Deck {
	public readonly cards: ReadonlyArray<Card>;

	public constructor(...cards: Card[]) {
		this.cards = cards;
	}

	public [Symbol.iterator](): Iterator<Card> {
		return this.cards[Symbol.iterator]();
	}

	public get amountOfCards(): number {
		return this.cards.length;
	}

	public cardsDueForReview(): Deck {
		return new Deck(...this.cards.filter((card) => card.isDueForReview()));
	}

	public cardsNotDueForReview(): Deck {
		return new Deck(...this.cards.filter((card) => !card.isDueForReview()));
	}

	public mergeWith(other: Deck): Deck {
		return new Deck(...this.cards, ...other.cards);
	}
}
