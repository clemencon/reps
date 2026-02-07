import type { Deck } from "./Deck.js";

// Assembles decks on every call.
// This is a simple implementation for now and can be optimized while testing performance if necessary.
export class Topic {
	public constructor(
		public readonly name: string,
		public readonly deck: Deck,
		public readonly subtopics: readonly Topic[] = [],
	) {}

	public get containsSubtopics(): boolean {
		return this.subtopics.length > 0;
	}

	public get amountOfSubtopics(): number {
		return this.subtopics.length;
	}

	public get totalAmountOfCards(): number {
		return this.assembleTopicDeck().amountOfCards;
	}

	public amountOfCardsDueForReview(): number {
		return this.assembleReviewDeck().amountOfCards;
	}

	public amountOfCardsNotDueForReview(): number {
		return this.assembleTopicDeck().cardsDueForReview().amountOfCards;
	}

	public assembleReviewDeck(): Deck {
		return this.assembleTopicDeck().cardsDueForReview();
	}

	public assembleTopicDeck(): Deck {
		const subtopicDecks = this.subtopics.map((subtopic) => subtopic.assembleTopicDeck());
		return subtopicDecks.reduce(
			(topicDeck, subtopicDeck) => topicDeck.mergeWith(subtopicDeck),
			this.deck,
		);
	}

	public listAllTopics(): Topic[] {
		return this.flattenTopicTree(this);
	}

	private flattenTopicTree(topic: Topic): Topic[] {
		const subtopics = topic.subtopics.flatMap((subtopic) => this.flattenTopicTree(subtopic));
		return [topic, ...subtopics];
	}
}
