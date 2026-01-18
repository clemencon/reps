import type { ScheduledCard } from "./ScheduledCard.js";

export class Deck {
	public readonly cards: ReadonlyArray<ScheduledCard>;

	public constructor(...cards: ScheduledCard[]) {
		this.cards = cards;
	}

	public [Symbol.iterator](): Iterator<ScheduledCard> {
		return this.cards[Symbol.iterator]();
	}
}
