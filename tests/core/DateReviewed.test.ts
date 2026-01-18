import { describe, expect, test } from "vitest";
import { DateReviewed } from "../../src/core/DateReviewed.js";

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

	test("daysSinceReview returns 0 for today's review", () => {
		const today = new Date();
		const dateReviewed = new DateReviewed(today);
		expect(dateReviewed.daysSinceReview).toBe(0);
	});

	test("daysSinceReview returns exact days for past reviews", () => {
		const fiveDaysAgo = new Date();
		fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
		const dateReviewed = new DateReviewed(fiveDaysAgo);
		expect(dateReviewed.daysSinceReview).toBe(5);
	});

	test("daysSinceReview returns correct count for longer periods", () => {
		const tenDaysAgo = new Date();
		tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
		const dateReviewed = new DateReviewed(tenDaysAgo);
		expect(dateReviewed.daysSinceReview).toBe(10);
	});

	test("daysSinceReview floors partial days", () => {
		const almostOneDayAgo = new Date();
		almostOneDayAgo.setHours(almostOneDayAgo.getHours() - 23);
		const dateReviewed = new DateReviewed(almostOneDayAgo);
		expect(dateReviewed.daysSinceReview).toBe(0);
	});

	test("toIsoString() returns full ISO date string", () => {
		const date = new Date("2024-03-15T10:30:00.000Z");
		const dateReviewed = new DateReviewed(date);
		expect(dateReviewed.toIsoString()).toBe("2024-03-15T10:30:00.000Z");
	});
});
