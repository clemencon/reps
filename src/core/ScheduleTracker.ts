import type { Schedule } from "./Schedule.js";

export interface ScheduleTracker {
	store(schedule: Schedule, cardId: string): void;
	get(cardId: string): Schedule;
	getAll(): Record<string, Schedule>;
}
