import { describe, expect, test } from "vitest";
import { ConsecutiveSuccesses } from "../src/ConsecutiveSuccesses.js";
import { Grade } from "../src/Grade.js";
import { MemoryStrength } from "../src/MemoryStrength.js";
import { ReviewInterval } from "../src/ReviewInterval.js";
import { Schedule } from "../src/Schedule.js";

const reviewGradeArguments = [0, 1, 2, 3, 4, 5];
const consecutiveSuccessesArguments = [0, 1, 2, 3];
const memoryStrengthArguments = [1.3, 2.0, 2.5, 3.0, 4.0, 5.0];
const reviewIntervalArguments = [0, 1, 5, 10, 25, 50, 99];

function* generateArguments(): Generator<[number, number, number, number]> {
	for (const reviewGrade of reviewGradeArguments) {
		for (const consecutiveSuccesses of consecutiveSuccessesArguments) {
			for (const memoryStrength of memoryStrengthArguments) {
				for (const reviewInterval of reviewIntervalArguments) {
					yield [reviewGrade, consecutiveSuccesses, memoryStrength, reviewInterval];
				}
			}
		}
	}
}

/**
 * Snapshot test for the SM-2 spaced repetition algorithm.
 *
 * See: https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm
 */
describe("sm2", () => {
	test("approval test", () => {
		let output = "";
		for (const [
			reviewGrade,
			consecutiveSuccesses,
			memoryStrength,
			reviewInterval,
		] of generateArguments()) {
			const schedule = new Schedule(
				new ConsecutiveSuccesses(consecutiveSuccesses),
				new MemoryStrength(memoryStrength),
				new ReviewInterval(reviewInterval),
			);
			const recalculatedSchedule = schedule.recalculateAfterReview(new Grade(reviewGrade));
			const result = {
				n: recalculatedSchedule.consecutiveSuccesses.count,
				EF: recalculatedSchedule.memoryStrength.value,
				I: recalculatedSchedule.reviewInterval.days,
			};

			output += `q: ${reviewGrade} n: ${consecutiveSuccesses} ef: ${memoryStrength} i: ${reviewInterval}`;
			output += ` -> n: ${result.n} ef: ${result.EF} i: ${result.I}\n`;
		}
		expect(output).toMatchSnapshot();
	});
});
