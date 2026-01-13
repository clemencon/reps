import type { ScheduledCard } from "./ScheduledCard.js";

export class Deck {
	readonly cards: ReadonlyArray<ScheduledCard>;

	constructor(...cards: ScheduledCard[]) {
		this.cards = cards;
	}

	[Symbol.iterator](): Iterator<ScheduledCard> {
		return this.cards[Symbol.iterator]();
	}
}
