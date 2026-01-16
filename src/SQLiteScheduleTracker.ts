import type { Card } from "./Card.js";
import type { ScheduledCard } from "./ScheduledCard.js";
import type { ScheduleTracker } from "./ScheduleTracker.js";

export class SQLiteScheduleTracker implements ScheduleTracker {
	public getFor(card: Card): ScheduledCard {}
	public saveFor(card: ScheduledCard): void {}
}
