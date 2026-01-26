import { describe, expect, test } from "vitest";
import { Card } from "../../../src/core/cataloging/Card.js";
import { Schedule } from "../../../src/core/scheduling/Schedule.js";

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

	test("has a content-based id", () => {
		const card = new Card("What is the answer?", "Some answer.");
		expect(typeof card.id).toBe("string");
		expect(card.id).toHaveLength(8);
	});

	test("has the same id for identical content", () => {
		const card1 = new Card("What is the answer?", "Some answer.");
		const card2 = new Card("What is the answer?", "Some answer.");
		expect(card1.id).toBe(card2.id);
	});

	test("has different ids for different content", () => {
		const card1 = new Card("What is the answer?", "Some answer.");
		const card2 = new Card("What is the answer?", "Different answer.");
		const card3 = new Card("Different question?", "Some answer.");
		expect(card1.id).not.toBe(card2.id);
		expect(card1.id).not.toBe(card3.id);
		expect(card2.id).not.toBe(card3.id);
	});

	test("card with no schedule is due for review", () => {
		const card = new Card("What is the answer?", "Some answer.");
		const schedule = card.getSchedule();
		expect(schedule.lastReview).toBeNull();
		expect(card.isDueForReview()).toBe(true);
	});

	test("card with schedule delegates isDueForReview", () => {
		const schedule = Schedule.forNewCard();
		const card = new Card("What is the answer?", "Some answer.", schedule);
		expect(card.isDueForReview()).toBe(schedule.isDueForReview());
	});

	test("a new schedule can be added", () => {
		const card = new Card("What is the answer?", "Some answer.");
		const schedule = Schedule.forNewCard();

		card.addSchedule(schedule);

		expect(card.getSchedule()).toBe(schedule);
	});

	test("a new schedule cannot be added to a card with an existing schedule", () => {
		const schedule = Schedule.forNewCard();
		const card = new Card("What is the answer?", "Some answer.", schedule);

		expect(() => card.addSchedule(Schedule.forNewCard())).toThrowError("Card already scheduled.");
	});
});
