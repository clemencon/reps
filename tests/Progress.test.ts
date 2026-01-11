import { describe, expect, test } from "vitest";
import { ConsecutiveSuccesses } from "../src/ConsecutiveSuccesses.js";
import { Grade } from "../src/Grade.js";
import { MemoryStrength } from "../src/MemoryStrength.js";
import { Progress } from "../src/Progress.js";
import { ReviewInterval } from "../src/ReviewInterval.js";

describe("Progress", () => {
	describe("SM-2 spaced repetition algorithm", () => {
		test("failing a card resets progress to start over tomorrow", () => {
			const wellLearnedCard = new Progress(
				new ConsecutiveSuccesses(5),
				new MemoryStrength(2.5),
				new ReviewInterval(30),
			);

			const afterFailing = wellLearnedCard.recalculateAfterReview(new Grade(2));

			expect(afterFailing.consecutiveSuccesses.count).toBe(0);
			expect(afterFailing.reviewInterval.days).toBe(1);
		});

		test("first correct response schedules review for tomorrow", () => {
			const newCard = new Progress();

			const afterFirstSuccess = newCard.recalculateAfterReview(new Grade(4));

			expect(afterFirstSuccess.consecutiveSuccesses.count).toBe(1);
			expect(afterFirstSuccess.reviewInterval.days).toBe(1);
		});

		test("second correct response schedules review in 6 days", () => {
			const cardSeenOnce = new Progress(
				new ConsecutiveSuccesses(1),
				new MemoryStrength(2.5),
				new ReviewInterval(1),
			);

			const afterSecondSuccess = cardSeenOnce.recalculateAfterReview(new Grade(4));

			expect(afterSecondSuccess.consecutiveSuccesses.count).toBe(2);
			expect(afterSecondSuccess.reviewInterval.days).toBe(6);
		});

		test("third correct response and beyond extends interval by memory strength factor", () => {
			const cardSeenTwice = new Progress(
				new ConsecutiveSuccesses(2),
				new MemoryStrength(2.5),
				new ReviewInterval(6),
			);

			const afterThirdSuccess = cardSeenTwice.recalculateAfterReview(new Grade(4));

			expect(afterThirdSuccess.consecutiveSuccesses.count).toBe(3);
			expect(afterThirdSuccess.reviewInterval.days).toBe(15);
		});

		test("stronger memory extends intervals more aggressively", () => {
			const baseProgress = new Progress(
				new ConsecutiveSuccesses(2),
				new MemoryStrength(2.5),
				new ReviewInterval(10),
			);
			const strongerMemory = new Progress(
				new ConsecutiveSuccesses(2),
				new MemoryStrength(4.0),
				new ReviewInterval(10),
			);

			const normalGrowth = baseProgress.recalculateAfterReview(new Grade(4));
			const acceleratedGrowth = strongerMemory.recalculateAfterReview(new Grade(4));

			expect(normalGrowth.reviewInterval.days).toBe(25);
			expect(acceleratedGrowth.reviewInterval.days).toBe(40);
		});
	});
});
