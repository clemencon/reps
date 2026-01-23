import { existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { SQLiteScheduleTracker } from "../../src/app/SQLiteScheduleTracker.js";
import { Card } from "../../src/core/Card.js";
import { Grade } from "../../src/core/Grade.js";
import { Schedule } from "../../src/core/Schedule.js";

describe("SQLiteScheduleTracker (in-memory)", () => {
	let scheduleTracker: SQLiteScheduleTracker;

	beforeEach(() => {
		scheduleTracker = new SQLiteScheduleTracker(":memory:");
	});

	afterEach(() => {
		scheduleTracker.close();
	});

	test("returns a new card schedule for untracked cards", () => {
		const schedule = scheduleTracker.get("unknown-card-id");

		expect(schedule.isDueForReview()).toBe(true);
		expect(schedule.lastReview).toBeNull();
	});

	test("restores previously stored schedules", () => {
		const card = new Card("What is 2+2?", "4");
		const reviewed = card.selfEvaluate(new Grade(4));
		const reviewedSchedule = reviewed.schedule;
		if (reviewedSchedule === null) throw new Error("Expected schedule to exist after review");
		scheduleTracker.store(reviewedSchedule, card.id);

		const restored = scheduleTracker.get(card.id);

		expect(restored.consecutiveSuccesses.count).toBe(reviewedSchedule.consecutiveSuccesses.count);
		expect(restored.memoryStrength.value).toBe(reviewedSchedule.memoryStrength.value);
		expect(restored.reviewInterval.days).toBe(reviewedSchedule.reviewInterval.days);
	});

	test("does not persist schedules that have never been reviewed", () => {
		const newCardSchedule = Schedule.forNewCard();
		scheduleTracker.store(newCardSchedule, "card-id");

		const restored = scheduleTracker.get("card-id");

		expect(restored.lastReview).toBeNull();
	});

	test("returns empty record when no schedules are stored", () => {
		const all = scheduleTracker.getAll();

		expect(all).toEqual({});
	});

	test("returns all stored schedules", () => {
		const card1 = new Card("Question 1?", "Answer 1");
		const card2 = new Card("Question 2?", "Answer 2");
		const reviewed1 = card1.selfEvaluate(new Grade(4));
		const reviewed2 = card2.selfEvaluate(new Grade(5));
		if (reviewed1.schedule === null || reviewed2.schedule === null) {
			throw new Error("Expected schedules to exist after review");
		}
		scheduleTracker.store(reviewed1.schedule, card1.id);
		scheduleTracker.store(reviewed2.schedule, card2.id);

		const all = scheduleTracker.getAll();

		expect(Object.keys(all)).toHaveLength(2);
		expect(all[card1.id]?.consecutiveSuccesses.count).toBe(
			reviewed1.schedule?.consecutiveSuccesses.count,
		);
		expect(all[card2.id]?.consecutiveSuccesses.count).toBe(
			reviewed2.schedule?.consecutiveSuccesses.count,
		);
	});
});

describe("SQLiteScheduleTracker (filesystem)", () => {
	test("creates the database directory if it does not exist", () => {
		const testDir = join(tmpdir(), `reps-test-${Date.now()}`);
		const dbPath = join(testDir, "test.db");

		const tracker = new SQLiteScheduleTracker(dbPath);

		expect(existsSync(testDir)).toBe(true);
		tracker.close();
		rmSync(testDir, { recursive: true });
	});
});
