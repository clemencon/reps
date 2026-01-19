import type { Card } from "./Card.js";
import type { Grade } from "./Grade.js";
import { Schedule } from "./Schedule.js";

export class ScheduledCard {
	public constructor(
		public readonly card: Card,
		public readonly schedule: Schedule,
	) {}

	public static fromUnreviewed(card: Card): ScheduledCard {
		return new ScheduledCard(card, Schedule.forNewCard());
	}

	public get id(): string {
		return this.card.id;
	}

	public isDueForReview(): boolean {
		return this.schedule.isDueForReview();
	}

	public selfEvaluate(grade: Grade): ScheduledCard {
		const schedule = this.schedule.recalculateAfterReview(grade);
		return new ScheduledCard(this.card, schedule);
	}
}
