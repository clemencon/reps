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

	public assembleTopicDeck(): Deck {
		const subtopicDecks = this.subtopics.map((subtopic) => subtopic.assembleTopicDeck());
		return subtopicDecks.reduce(
			(topicDeck, subtopicDeck) => topicDeck.mergeWith(subtopicDeck),
			this.deck,
		);
	}

	// public amountOfCardsToReview(): number {}

	// public assembleReviewDeck(): Deck {}
}
