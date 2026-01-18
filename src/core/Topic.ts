import type { Deck } from "./Deck.js";

export class Topic {
	public constructor(
		public readonly name: string,
		public readonly cards: Deck,
		public readonly subtopics: readonly Topic[] = [],
	) {}

	public get containsSubtopics(): boolean {
		return this.subtopics.length > 0;
	}
}
