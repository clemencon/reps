import { ConsecutiveSuccesses } from "./ConsecutiveSuccesses.js";
import type { Grade } from "./Grade.js";
import { MemoryStrength } from "./MemoryStrength.js";
import { ReviewInterval } from "./ReviewInterval.js";

export class Progress {
	public constructor(
		public readonly consecutiveSuccesses: ConsecutiveSuccesses = new ConsecutiveSuccesses(),
		public readonly memoryStrength: MemoryStrength = new MemoryStrength(),
		public readonly reviewInterval: ReviewInterval = new ReviewInterval(),
	) {}

	public recalculateAfterReview(grade: Grade): Progress {
		let newConsecutiveSuccesses = new ConsecutiveSuccesses();
		const newMemoryStrength = this.memoryStrength.recalculateAfterReview(grade);
		let newReviewInterval = new ReviewInterval(1);

		if (grade.isCorrectResponse) {
			newConsecutiveSuccesses = this.consecutiveSuccesses.increment();
			if (this.consecutiveSuccesses.count === 1) {
				newReviewInterval = new ReviewInterval(6);
			}
			if (this.consecutiveSuccesses.count > 1) {
				newReviewInterval = new ReviewInterval(
					Math.round(this.reviewInterval.days * this.memoryStrength.value),
				);
			}
		}

		return new Progress(newConsecutiveSuccesses, newMemoryStrength, newReviewInterval);
	}
}
