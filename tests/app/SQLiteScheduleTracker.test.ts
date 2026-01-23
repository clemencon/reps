import { existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { SQLiteScheduleTracker } from "../../src/app/SQLiteScheduleTracker.js";
import { Card } from "../../src/core/Card.js";
import { Deck } from "../../src/core/Deck.js";
import { Grade } from "../../src/core/Grade.js";

describe("SQLiteScheduleTracker", () => {
	let scheduleTracker: SQLiteScheduleTracker;

	beforeEach(() => {
		scheduleTracker = new SQLiteScheduleTracker(":memory:");
	});

	afterEach(() => {
		scheduleTracker.close();
	});

	test("returns unreviewed schedules for cards not yet tracked", () => {
		const card = new Card("What is 2+2?", "4");

		const deck = scheduleTracker.getFor(new Deck(card));

		const [restoredCard] = [...deck];
		expect(restoredCard?.isDueForReview()).toBe(true);
	});

	test("restores previously saved schedules", () => {
		const card = new Card("What is 2+2?", "4");
		const reviewed = card.selfEvaluate(new Grade(4));
		scheduleTracker.saveFor(reviewed);

		const deck = scheduleTracker.getFor(new Deck(card));

		const [restored] = [...deck];
		expect(restored?.schedule?.consecutiveSuccesses.count).toBe(
			reviewed.schedule?.consecutiveSuccesses.count,
		);
		expect(restored?.schedule?.memoryStrength.value).toBe(reviewed.schedule?.memoryStrength.value);
		expect(restored?.schedule?.reviewInterval.days).toBe(reviewed.schedule?.reviewInterval.days);
	});

	test("does not persist cards that have never been reviewed", () => {
		const card = new Card("What is 2+2?", "4");
		scheduleTracker.saveFor(card);

		const deck = scheduleTracker.getFor(new Deck(card));

		const [restored] = [...deck];
		expect(restored).toBeDefined();
		expect(restored?.schedule).toBeNull();
	});

	test("creates the database directory if it does not exist", () => {
		const testDir = join(tmpdir(), `reps-test-${Date.now()}`);
		const dbPath = join(testDir, "test.db");

		const tracker = new SQLiteScheduleTracker(dbPath);

		expect(existsSync(testDir)).toBe(true);
		tracker.close();
		rmSync(testDir, { recursive: true });
	});
});
