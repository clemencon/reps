import { describe, expect, test } from "vitest";
import { DateReviewed } from "../../../src/core/scheduling/DateReviewed.js";

describe("DateReviewed", () => {
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

	test("daysSinceReview floors partial days", () => {
		const almostOneDayAgo = new Date();
		almostOneDayAgo.setHours(almostOneDayAgo.getHours() - 23);
		const dateReviewed = new DateReviewed(almostOneDayAgo);
		expect(dateReviewed.daysSinceReview).toBe(0);
	});
});
