import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Grade } from "../../src/core/Grade.js";
import { Schedule } from "../../src/core/Schedule.js";

describe("Schedule", () => {
	describe("SM-2 spaced repetition algorithm", () => {
		test("failing a card resets schedule to start over tomorrow", () => {
			const forNewCard = Schedule.forNewCard();
			const afterFirstSuccess = forNewCard.recalculateAfterReview(new Grade(4));
			const afterSecondSuccess = afterFirstSuccess.recalculateAfterReview(new Grade(4));
			const afterFailure = afterSecondSuccess.recalculateAfterReview(new Grade(2));

			expect(afterFailure.consecutiveSuccesses.count).toBe(0);
			expect(afterFailure.reviewInterval.days).toBe(1);
		});

		test("first correct response schedules review for tomorrow", () => {
			const forNewCard = Schedule.forNewCard();
			const afterFirstSuccess = forNewCard.recalculateAfterReview(new Grade(4));

			expect(afterFirstSuccess.consecutiveSuccesses.count).toBe(1);
			expect(afterFirstSuccess.reviewInterval.days).toBe(1);
		});

		test("second correct response schedules review in 6 days", () => {
			const forNewCard = Schedule.forNewCard();
			const afterFirstSuccess = forNewCard.recalculateAfterReview(new Grade(4));
			const afterSecondSuccess = afterFirstSuccess.recalculateAfterReview(new Grade(4));

			expect(afterSecondSuccess.consecutiveSuccesses.count).toBe(2);
			expect(afterSecondSuccess.reviewInterval.days).toBe(6);
		});

		test("third correct response and beyond extends interval by memory strength factor", () => {
			const forNewCard = Schedule.forNewCard();
			const afterFirstSuccess = forNewCard.recalculateAfterReview(new Grade(4));
			const afterSecondSuccess = afterFirstSuccess.recalculateAfterReview(new Grade(4));
			const afterThirdSuccess = afterSecondSuccess.recalculateAfterReview(new Grade(4));

			expect(afterThirdSuccess.consecutiveSuccesses.count).toBe(3);
			expect(afterThirdSuccess.reviewInterval.days).toBe(15);
		});

		test("stronger memory extends intervals faster", () => {
			const forNewCard = Schedule.forNewCard();

			const perfect1 = forNewCard.recalculateAfterReview(new Grade(5));
			const perfect2 = perfect1.recalculateAfterReview(new Grade(5));
			const perfect3 = perfect2.recalculateAfterReview(new Grade(5));

			const minimal1 = forNewCard.recalculateAfterReview(new Grade(3));
			const minimal2 = minimal1.recalculateAfterReview(new Grade(3));
			const minimal3 = minimal2.recalculateAfterReview(new Grade(3));

			expect(perfect3.reviewInterval.days).toBeGreaterThan(minimal3.reviewInterval.days);
		});
	});

	describe("isDueForReview", () => {
		beforeEach(() => vi.useFakeTimers());
		afterEach(() => vi.useRealTimers());

		const letDaysPass = (days: number): void => {
			const oneDayMs = 24 * 60 * 60 * 1000;
			vi.advanceTimersByTime(days * oneDayMs);
		};

		test("a new card that has never been studied is due for review", () => {
			const schedule = Schedule.forNewCard();
			expect(schedule.isDueForReview()).toBe(true);
		});

		test("a card reviewed today is not due when interval has not passed", () => {
			const schedule = Schedule.forNewCard().recalculateAfterReview(new Grade(4));

			expect(schedule.isDueForReview()).toBe(false);
		});

		test("card becomes due when days since review meets interval", () => {
			const schedule = Schedule.forNewCard().recalculateAfterReview(new Grade(4));

			letDaysPass(1);

			expect(schedule.isDueForReview()).toBe(true);
		});

		test("card with longer interval is not due until interval passes", () => {
			const afterFirstReview = Schedule.forNewCard().recalculateAfterReview(new Grade(4));
			const afterSecondReview = afterFirstReview.recalculateAfterReview(new Grade(4));

			expect(afterSecondReview.reviewInterval.days).toBe(6);
			expect(afterSecondReview.isDueForReview()).toBe(false);

			letDaysPass(5);
			expect(afterSecondReview.isDueForReview()).toBe(false);

			letDaysPass(1);
			expect(afterSecondReview.isDueForReview()).toBe(true);
		});
	});
});
