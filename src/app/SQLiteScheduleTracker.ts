import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { Schedule } from "../core/Schedule.js";
import type { ScheduleTracker } from "../core/ScheduleTracker.js";

export class SQLiteScheduleTracker implements ScheduleTracker {
	private readonly db: Database.Database;
	private readonly cachedSchedules: SchedulesCache;

	public constructor(databasePath: string) {
		this.ensureDirectoryExists(databasePath);
		this.db = new Database(databasePath);
		this.initializeSchema();
		this.cachedSchedules = this.getAll();
	}

	public get(cardId: string): Schedule {
		return this.cachedSchedules[cardId] ?? Schedule.forNewCard();
	}

	public store(schedule: Schedule, cardId: string): void {
		if (schedule.lastReview === null) return;

		this.db
			.prepare(`
			INSERT INTO schedule (card_id, consecutive_successes, memory_strength, review_interval_days, reviewed_on)
			VALUES (
				'${cardId}',
				${schedule.consecutiveSuccesses.count},
				${schedule.memoryStrength.value},
				${schedule.reviewInterval.days},
				'${schedule.lastReview.toIsoString()}'
		    )
			ON CONFLICT(card_id) DO UPDATE SET
				consecutive_successes = excluded.consecutive_successes,
				memory_strength = excluded.memory_strength,
				review_interval_days = excluded.review_interval_days,
				reviewed_on = excluded.reviewed_on,
				updated_at = CURRENT_TIMESTAMP
		`)
			.run();
		this.cachedSchedules[cardId] = schedule;
	}

	public close(): void {
		this.db.close();
	}

	private getAll(): SchedulesCache {
		const rows = this.db
			.prepare<
				[],
				{
					card_id: string;
					consecutive_successes: number;
					memory_strength: number;
					review_interval_days: number;
					reviewed_on: string;
				}
			>(`
			SELECT card_id, consecutive_successes, memory_strength, review_interval_days, reviewed_on
			FROM schedule
		`)
			.all();

		const result: SchedulesCache = {};
		for (const row of rows) {
			result[row.card_id] = Schedule.parse(
				row.consecutive_successes,
				row.memory_strength,
				row.review_interval_days,
				row.reviewed_on,
			);
		}
		return result;
	}

	private ensureDirectoryExists(databasePath: string): void {
		if (databasePath === ":memory:") return;
		const directory = dirname(databasePath);
		mkdirSync(directory, { recursive: true });
	}

	private initializeSchema(): void {
		this.db.exec(` CREATE TABLE IF NOT EXISTS schedule (
				card_id TEXT PRIMARY KEY,
				consecutive_successes INTEGER NOT NULL,
				memory_strength REAL NOT NULL,
				review_interval_days INTEGER NOT NULL,
				reviewed_on DATETIME NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`);
	}
}

type SchedulesCache = Record<string, Schedule>;
