import type { Card } from "./Card.js";
import type { DateReviewed } from "./DateReviewed.js";
import type { Progress } from "./Progress.js";

export class ScheduledCard {
	public constructor(
		public readonly card: Card,
		public readonly progress: Progress,
		public readonly lastReview: DateReviewed,
	) {}
}
