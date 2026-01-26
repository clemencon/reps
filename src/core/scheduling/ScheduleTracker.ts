import type { Card } from "../cataloging/Card.js";
import type { Schedule } from "./Schedule.js";

export interface ScheduleTracker {
	get(card: Card): Schedule;
	store(card: Card): void;
}
