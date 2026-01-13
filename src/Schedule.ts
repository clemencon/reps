import { ConsecutiveSuccesses } from "./ConsecutiveSuccesses.js";
import type { Grade } from "./Grade.js";
import { MemoryStrength } from "./MemoryStrength.js";
import { ReviewInterval } from "./ReviewInterval.js";

export class Schedule {
	public constructor(
		public readonly consecutiveSuccesses: ConsecutiveSuccesses = new ConsecutiveSuccesses(),
		public readonly memoryStrength: MemoryStrength = new MemoryStrength(),
		public readonly reviewInterval: ReviewInterval = new ReviewInterval(),
	) {}

	public recalculateAfterReview(grade: Grade): Schedule {
		if (grade.isCorrect) return this.recalculateAfterSuccess(grade);
		return this.recalculateAfterFailure(grade);
	}

	private recalculateAfterSuccess(grade: Grade): Schedule {
		const consecutiveSuccesses = this.consecutiveSuccesses.increment();
		const memoryStrength = this.memoryStrength.recalculateAfterReview(grade);
		const reviewInterval = this.recalculateReviewInterval();
		return new Schedule(consecutiveSuccesses, memoryStrength, reviewInterval);
	}

	private recalculateAfterFailure(grade: Grade): Schedule {
		const consecutiveSuccesses = new ConsecutiveSuccesses();
		const memoryStrength = this.memoryStrength.recalculateAfterReview(grade);
		const reviewInterval = new ReviewInterval(1);
		return new Schedule(consecutiveSuccesses, memoryStrength, reviewInterval);
	}

	private recalculateReviewInterval(): ReviewInterval {
		if (this.consecutiveSuccesses.count === 0) return new ReviewInterval(1);
		if (this.consecutiveSuccesses.count === 1) return new ReviewInterval(6);
		return new ReviewInterval(Math.round(this.reviewInterval.days * this.memoryStrength.value));
	}
}
