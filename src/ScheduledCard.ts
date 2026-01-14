import type { Card } from "./Card.js";
import type { Schedule } from "./Schedule.js";

export class ScheduledCard {
	public constructor(
		public readonly card: Card,
		public readonly schedule: Schedule,
	) {}
}
