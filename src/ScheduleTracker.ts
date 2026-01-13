import type { Card } from "./Card.js";
import type { ScheduledCard } from "./ScheduledCard.js";

export interface ScheduleTracker {
	getFor(card: Card): ScheduledCard;
}
