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

	public shuffle(): Deck {
		if (this.cards.length < 2) return new Deck(...this.cards);

		const shuffledCards = [...this.cards];
		do {
			for (let i = shuffledCards.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				// Using the footgun to aim between the toes.
				// biome-ignore lint/style/noNonNullAssertion: Indices are always within bounds when using length - 1.
				[shuffledCards[i], shuffledCards[j]] = [shuffledCards[j]!, shuffledCards[i]!];
			}
		} while (shuffledCards.every((card, index) => card === this.cards[index]));

		return new Deck(...shuffledCards);
	}
}
