import { describe, expect, test } from "vitest";
import { ConsecutiveSuccesses } from "../../../src/core/scheduling/ConsecutiveSuccesses.js";

describe("ConsecutiveSuccesses", () => {
	test("starts at zero by default", () => {
		const successes = new ConsecutiveSuccesses();
		expect(successes.count).toBe(0);
	});

	test("can start at a specific count", () => {
		const successes = new ConsecutiveSuccesses(5);
		expect(successes.count).toBe(5);
	});

	test("cannot be negative", () => {
		expect(() => new ConsecutiveSuccesses(-1)).toThrowError(
			"Invalid count: -1. Must be at least 0.",
		);
	});

	test("increment returns a new instance with count increased by one", () => {
		const initial = new ConsecutiveSuccesses(3);
		const incremented = initial.increment();
		expect(initial.count).toBe(3);
		expect(incremented.count).toBe(4);
	});
});
