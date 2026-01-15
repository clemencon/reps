import { describe, expect, test } from "vitest";
import { Card } from "../src/Card.js";
import { Grade } from "../src/Grade.js";
import { Schedule } from "../src/Schedule.js";
import { ScheduledCard } from "../src/ScheduledCard.js";

describe("ScheduledCard", () => {
	test("new cards are immediately due for review", () => {
		const card = new Card("What is the answer?", "Some answer.");
		const schedule = Schedule.forNewCard();
		const scheduledCard = new ScheduledCard(card, schedule);

		expect(scheduledCard.isDueForReview()).toBe(true);
	});

	test("self-evaluation records the review", () => {
		const card = new Card("What is the answer?", "Some answer.");
		const schedule = Schedule.forNewCard();
		const scheduledCard = new ScheduledCard(card, schedule);

		const evaluated = scheduledCard.selfEvaluate(new Grade(4));

		expect(evaluated.schedule.lastReview).not.toBeNull(); // ju: Fix this.
	});
});
