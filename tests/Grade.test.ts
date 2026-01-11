import { describe, expect, test } from "vitest";
import { Grade } from "../src/Grade.js";

describe("Grade", () => {
	test("has a value between 0 and 5", () => {
		expect(new Grade(0).value).toBe(0);
		expect(new Grade(5).value).toBe(5);
	});

	test("grades 3 and above are correct responses", () => {
		expect(new Grade(3).isCorrectResponse).toBe(true);
		expect(new Grade(4).isCorrectResponse).toBe(true);
		expect(new Grade(5).isCorrectResponse).toBe(true);
	});

	test("grades below 3 are incorrect responses", () => {
		expect(new Grade(0).isCorrectResponse).toBe(false);
		expect(new Grade(1).isCorrectResponse).toBe(false);
		expect(new Grade(2).isCorrectResponse).toBe(false);
	});

	test("rejects values below 0", () => {
		expect(() => new Grade(-1)).toThrowError(
			"Invalid grade: -1. Must be an integer between 0 and 5.",
		);
	});

	test("rejects values above 5", () => {
		expect(() => new Grade(6)).toThrowError(
			"Invalid grade: 6. Must be an integer between 0 and 5.",
		);
	});

	test("rejects non-integers", () => {
		expect(() => new Grade(2.5)).toThrowError(
			"Invalid grade: 2.5. Must be an integer between 0 and 5.",
		);
	});
});
