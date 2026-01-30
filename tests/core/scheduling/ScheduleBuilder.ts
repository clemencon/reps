import { Schedule } from "../../../src/core/scheduling/Schedule.js";

export class ScheduleBuilder {
	private consecutiveSuccesses: number = 0;
	private memoryStrength: number = 0;
	private reviewInterval: number = 0;
	private lastReview: string = "";

	public due(): ScheduleBuilder {
		this.consecutiveSuccesses = 2;
		this.memoryStrength = 2.5;
		this.reviewInterval = 6;
		this.lastReview = ScheduleBuilder.daysAgo(7);
		return this;
	}

	public notDue(): ScheduleBuilder {
		this.consecutiveSuccesses = 2;
		this.memoryStrength = 2.5;
		this.reviewInterval = 6;
		this.lastReview = ScheduleBuilder.daysAgo(2);
		return this;
	}

	public build(): Schedule {
		return Schedule.parse(
			this.consecutiveSuccesses,
			this.memoryStrength,
			this.reviewInterval,
			this.lastReview,
		);
	}

	private static daysAgo(days: number): string {
		const date = new Date();
		date.setDate(date.getDate() - days);
		return date.toISOString().split("T")[0] as string;
	}
}
