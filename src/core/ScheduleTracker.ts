import type { Card } from "./Card.js";
import type { Deck } from "./Deck.js";
import type { ScheduledCard } from "./ScheduledCard.js";

export interface ScheduleTracker {
	getFor(...cards: Card[]): Deck;
	saveFor(card: ScheduledCard): void;
}
