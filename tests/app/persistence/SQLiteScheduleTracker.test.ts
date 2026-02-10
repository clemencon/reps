import { existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import type { Config } from "../../../src/app/Config.js";
import { SQLiteScheduleTracker } from "../../../src/app/persistence/SQLiteScheduleTracker.js";
import { Card } from "../../../src/core/cataloging/Card.js";
import { Grade } from "../../../src/core/scheduling/Grade.js";
import { InMemoryConfig } from "./InMemoryConfig.js";

describe("SQLiteScheduleTracker (in-memory)", () => {
	let scheduleTracker: SQLiteScheduleTracker;

	beforeEach(() => {
		const config = new InMemoryConfig("???", "pat/to/catalog", ":memory:");
		scheduleTracker = new SQLiteScheduleTracker(config);
	});

	afterEach(() => {
		scheduleTracker.close();
	});

	test("returns a new card schedule for untracked cards", () => {
		const card = new Card("What is 1+1?", "2");
		const schedule = scheduleTracker.get(card);

		expect(schedule.isDueForReview()).toBe(true);
		expect(schedule.lastReview).toBeNull();
	});

	test("restores previously stored schedules", () => {
		const card = new Card("What is 2+2?", "4");
		card.selfEvaluate(new Grade(4));
		const reviewedSchedule = card.getSchedule();
		if (reviewedSchedule === null) throw new Error("Expected schedule to exist after review");
		scheduleTracker.store(card);

		const restored = scheduleTracker.get(card);

		expect(restored.consecutiveSuccesses.count).toBe(reviewedSchedule.consecutiveSuccesses.count);
		expect(restored.memoryStrength.value).toBe(reviewedSchedule.memoryStrength.value);
		expect(restored.reviewInterval.days).toBe(reviewedSchedule.reviewInterval.days);
	});

	test("does not persist schedules that have never been reviewed", () => {
		const card = new Card("What is 1+2?", "3");
		scheduleTracker.store(card);

		const restored = scheduleTracker.get(card);

		expect(restored.lastReview).toBeNull();
	});
});

describe("SQLiteScheduleTracker (filesystem)", () => {
	let testDir: string;
	let config: Config;
	let tracker: SQLiteScheduleTracker;

	beforeEach(() => {
		testDir = join(tmpdir(), `reps-test-${Date.now()}`);
		const dbPath = join(testDir, "test.db");
		config = new InMemoryConfig("???", "path/to/catalog", dbPath);
		tracker = new SQLiteScheduleTracker(config);
	});

	afterEach(() => {
		tracker.close();
		rmSync(testDir, { recursive: true });
	});

	test("creates the database directory if it does not exist", () => {
		expect(existsSync(testDir)).toBe(true);
	});

	test("loads schedules into cache on initialization", () => {
		const card = new Card("What is 5+5?", "10");
		card.selfEvaluate(new Grade(4));

		const reviewedSchedule = card.getSchedule();
		if (reviewedSchedule === null) throw new Error("Expected schedule to exist after review");

		tracker.store(card);
		tracker.close();

		const restoredTracker = new SQLiteScheduleTracker(config);
		const restored = restoredTracker.get(card);

		expect(restored.consecutiveSuccesses.count).toBe(reviewedSchedule.consecutiveSuccesses.count);
		expect(restored.memoryStrength.value).toBe(reviewedSchedule.memoryStrength.value);
		expect(restored.reviewInterval.days).toBe(reviewedSchedule.reviewInterval.days);

		restoredTracker.close();
	});
});
