import { describe, expect, test } from "vitest";
import { DateReviewed } from "../src/DateReviewed.js";
import { ReviewInterval } from "../src/ReviewInterval.js";

describe("DateReviewed", () => {
	test("today() captures current date", () => {
		const dateReviewed = DateReviewed.today();
		expect(dateReviewed).toBeDefined();
	});

	test("today's date can be parsed from an ISO string", () => {
		const today = new Date();
		const todayString = today.toISOString();
		const dateReviewed = DateReviewed.fromIsoDateString(todayString);
		expect(dateReviewed).toBeDefined();
		expect(dateReviewed.toIsoString()).toBe(todayString);
	});

	test("past dates can be parsed from an ISO string", () => {
		const dateReviewed = DateReviewed.fromIsoDateString("2024-03-15");
		expect(dateReviewed).toBeDefined();
	});

	test("future dates ISO strings can not be parsed", () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		const futureDateString = tomorrow.toISOString().split("T")[0] ?? "";
		expect(() => DateReviewed.fromIsoDateString(futureDateString)).toThrowError(
			"Invalid review date: cannot be in the future.",
		);
	});

	test("zero-day interval is immediately elapsed", () => {
		const today = new Date();
		const dateReviewed = new DateReviewed(today);
		expect(dateReviewed.hasElapsed(new ReviewInterval(0))).toBe(true);
	});

	test("one-day interval requires a full day", () => {
		const today = new Date();
		const dateReviewed = new DateReviewed(today);
		expect(dateReviewed.hasElapsed(new ReviewInterval(1))).toBe(false);
	});

	test("interval has elapsed when exact days have passed", () => {
		const fiveDaysAgo = new Date();
		fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
		const dateReviewed = new DateReviewed(fiveDaysAgo);
		expect(dateReviewed.hasElapsed(new ReviewInterval(5))).toBe(true);
	});

	test("interval has elapsed when days are exceeded", () => {
		const tenDaysAgo = new Date();
		tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
		const dateReviewed = new DateReviewed(tenDaysAgo);
		expect(dateReviewed.hasElapsed(new ReviewInterval(5))).toBe(true);
	});

	test("interval is not elapsed until full days pass", () => {
		const twoDaysAgo = new Date();
		twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
		const dateReviewed = new DateReviewed(twoDaysAgo);
		expect(dateReviewed.hasElapsed(new ReviewInterval(5))).toBe(false);
	});

	test("elapsed calculation uses actual time passed", () => {
		const almostOneDayAgo = new Date();
		almostOneDayAgo.setHours(almostOneDayAgo.getHours() - 23);
		const dateReviewed = new DateReviewed(almostOneDayAgo);
		expect(dateReviewed.hasElapsed(new ReviewInterval(1))).toBe(false);
	});

	test("toIsoString() returns full ISO date string", () => {
		const date = new Date("2024-03-15T10:30:00.000Z");
		const dateReviewed = new DateReviewed(date);
		expect(dateReviewed.toIsoString()).toBe("2024-03-15T10:30:00.000Z");
	});
});
