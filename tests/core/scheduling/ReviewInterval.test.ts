import { describe, expect, test } from "vitest";
import { ReviewInterval } from "../../../src/core/scheduling/ReviewInterval.js";

describe("ReviewInterval", () => {
	test("defaults to zero days", () => {
		const interval = new ReviewInterval();

		expect(interval.days).toBe(0);
	});

	test("can be created with a specific number of days", () => {
		const interval = new ReviewInterval(7);

		expect(interval.days).toBe(7);
	});

	test("cannot have negative days", () => {
		expect(() => new ReviewInterval(-1)).toThrowError(
			"Invalid amount of days: -1. Must be a non-negative integer.",
		);
	});

	test("cannot have fractional days", () => {
		expect(() => new ReviewInterval(1.5)).toThrowError(
			"Invalid amount of days: 1.5. Must be a non-negative integer.",
		);
	});
});
