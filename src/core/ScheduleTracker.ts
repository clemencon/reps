import type { Card } from "./Card.js";
import type { Deck } from "./Deck.js";

export interface ScheduleTracker {
	getFor(deck: Deck): Deck;
	saveFor(card: Card): void;
}
