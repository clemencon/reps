import { describe, expect, test } from "vitest";
import { Card } from "../../src/core/Card.js";
import { Grade } from "../../src/core/Grade.js";
import { ScheduledCard } from "../../src/core/ScheduledCard.js";

describe("ScheduledCard", () => {
	test("new cards are immediately due for review", () => {
		const card = new Card("What is the answer?", "Some answer.");
		const scheduledCard = ScheduledCard.fromUnreviewed(card);

		expect(scheduledCard.isDueForReview()).toBe(true);
	});

	test("self-evaluation records the review", () => {
		const card = new Card("What is the answer?", "Some answer.");
		const scheduledCard = ScheduledCard.fromUnreviewed(card);

		const evaluated = scheduledCard.selfEvaluate(new Grade(4));

		expect(evaluated.schedule.lastReview).not.toBeNull(); // ju: Fix this.
	});

	test("scheduled card identity is derived from the flashcard content", () => {
		const card = new Card("What is the answer?", "Some answer.");
		const scheduledCard = ScheduledCard.fromUnreviewed(card);

		expect(scheduledCard.id).toBe(card.id);
	});
});
