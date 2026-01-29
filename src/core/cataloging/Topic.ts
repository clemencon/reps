import type { Deck } from "./Deck.js";

export class Topic {
	public constructor(
		public readonly name: string,
		public readonly deck: Deck,
		public readonly subtopics: readonly Topic[] = [],
	) {}

	public get containsSubtopics(): boolean {
		return this.subtopics.length > 0;
	}

	public get totalAmountOfCards(): number {
		return this.deck.amountOfCards;
	}

	// public amountOfCardsToReview(): number {}

	// public assembleTopicDeck(): Deck {}

	// public assembleReviewDeck(): Deck {}
}
