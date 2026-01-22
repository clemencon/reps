import { ConsecutiveSuccesses } from "./ConsecutiveSuccesses.js";
import { DateReviewed } from "./DateReviewed.js";
import type { Grade } from "./Grade.js";
import { MemoryStrength } from "./MemoryStrength.js";
import { ReviewInterval } from "./ReviewInterval.js";

export class Schedule {
	public static forNewCard(): Schedule {
		const consecutiveSuccesses = new ConsecutiveSuccesses();
		const memoryStrength = new MemoryStrength();
		const reviewInterval = new ReviewInterval();
		const dateReviewed = null;
		return new Schedule(consecutiveSuccesses, memoryStrength, reviewInterval, dateReviewed);
	}

	public static parse(
		consecutiveSuccesses: number,
		memoryStrength: number,
		reviewInterval: number,
		lastReview: string,
	): Schedule {
		return new Schedule(
			new ConsecutiveSuccesses(consecutiveSuccesses),
			new MemoryStrength(memoryStrength),
			new ReviewInterval(reviewInterval),
			DateReviewed.fromIsoDateString(lastReview),
		);
	}

	public isDueForReview(): boolean {
		if (!this.hasBeenStudied()) return true;
		return this.lastReview.daysSinceReview >= this.reviewInterval.days;
	}

	public recalculateAfterReview(grade: Grade): Schedule {
		if (grade.isCorrect) return this.recalculateAfterSuccess(grade);
		return this.recalculateAfterFailure(grade);
	}

	private constructor(
		public readonly consecutiveSuccesses: ConsecutiveSuccesses,
		public readonly memoryStrength: MemoryStrength,
		public readonly reviewInterval: ReviewInterval,
		public readonly lastReview: DateReviewed | null,
	) {}

	private hasBeenStudied(): this is { lastReview: DateReviewed } {
		return this.lastReview !== null;
	}

	private recalculateAfterSuccess(grade: Grade): Schedule {
		const consecutiveSuccesses = this.consecutiveSuccesses.increment();
		const memoryStrength = this.memoryStrength.recalculateAfterReview(grade);
		const reviewInterval = this.recalculateReviewInterval();
		const dateReviewed = DateReviewed.today();
		return new Schedule(consecutiveSuccesses, memoryStrength, reviewInterval, dateReviewed);
	}

	private recalculateAfterFailure(grade: Grade): Schedule {
		const consecutiveSuccesses = new ConsecutiveSuccesses();
		const memoryStrength = this.memoryStrength.recalculateAfterReview(grade);
		const reviewInterval = new ReviewInterval(1);
		const dateReviewed = DateReviewed.today();
		return new Schedule(consecutiveSuccesses, memoryStrength, reviewInterval, dateReviewed);
	}

	private recalculateReviewInterval(): ReviewInterval {
		if (this.consecutiveSuccesses.count === 0) return new ReviewInterval(1);
		if (this.consecutiveSuccesses.count === 1) return new ReviewInterval(6);
		return new ReviewInterval(Math.round(this.reviewInterval.days * this.memoryStrength.value));
	}
}
