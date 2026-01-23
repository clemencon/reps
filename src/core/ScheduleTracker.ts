import type { Schedule } from "./Schedule.js";

export interface ScheduleTracker {
	get(cardId: string): Schedule;
	store(schedule: Schedule, cardId: string): void;
}
