import { Schedule } from "../../../src/core/scheduling/Schedule.js";

export class ScheduleBuilder {
	private consecutiveSuccesses: number = 0;
	private memoryStrength: number = 0;
	private reviewInterval: number = 0;
	private lastReview: string = "";

	public due(): ScheduleBuilder {
	}

	public reviewed(): ScheduleBuilder {
	}

	public build(): Schedule {
		return Schedule.parse(
			this.consecutiveSuccesses,
			this.memoryStrength,
			this.reviewInterval,
			this.lastReview,
		);
	}
}
