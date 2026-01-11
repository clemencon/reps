import { describe, expect, test } from "vitest";
import { Card } from "../src/Card.js";

describe("Card", () => {
	test("has a question and answer", () => {
		const card = new Card("What is the answer?", "Some answer.");
		expect(card.question).toBe("What is the answer?");
		expect(card.answer).toBe("Some answer.");
	});

	test("cannot have a blank question", () => {
		expect(() => new Card("", "Some answer.")).toThrowError("Question cannot be blank.");
		expect(() => new Card("   ", "Some answer.")).toThrowError("Question cannot be blank.");
	});

	test("cannot have a blank answer", () => {
		expect(() => new Card("What is the answer?", "")).toThrowError("Answer cannot be blank.");
		expect(() => new Card("What is the answer?", "   ")).toThrowError("Answer cannot be blank.");
	});
});
