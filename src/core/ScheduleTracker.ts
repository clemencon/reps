import type { Card } from "./Card.js";
import type { Schedule } from "./Schedule.js";

export interface ScheduleTracker {
	get(card: Card): Schedule;
	store(card: Card): void;
}
