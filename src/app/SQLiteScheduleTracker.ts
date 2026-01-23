import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { Card } from "../core/Card.js";
import { Deck } from "../core/Deck.js";
import { Schedule } from "../core/Schedule.js";
import type { ScheduleTracker } from "../core/ScheduleTracker.js";

export class SQLiteScheduleTracker implements ScheduleTracker {
	private readonly db: Database.Database;

	public constructor(databasePath: string) {
		this.ensureDirectoryExists(databasePath);
		this.db = new Database(databasePath);
		this.initializeSchema();
	}

	public getFor(deck: Deck): Deck {
		const cardsWithSchedule = deck.cards.map((card) => this.loadOrCreateSchedule(card));
		return new Deck(...cardsWithSchedule);
	}

	public saveFor(card: Card): void {
		if (card.schedule === null || card.schedule.lastReview === null) return; // Unscheduled cards need review anyway.

		this.db
			.prepare(`
			INSERT INTO schedule (card_id, consecutive_successes, memory_strength, review_interval_days, reviewed_on)
			VALUES ('${card.id}', ${card.schedule.consecutiveSuccesses.count}, ${card.schedule.memoryStrength.value}, ${card.schedule.reviewInterval.days}, '${card.schedule.lastReview.toIsoString()}')
			ON CONFLICT(card_id) DO UPDATE SET
				consecutive_successes = excluded.consecutive_successes,
				memory_strength = excluded.memory_strength,
				review_interval_days = excluded.review_interval_days,
				reviewed_on = excluded.reviewed_on,
				updated_at = CURRENT_TIMESTAMP
		`)
			.run();
	}

	public close(): void {
		this.db.close();
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

	private loadOrCreateSchedule(card: Card): Card {
		const row = this.db
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
			WHERE card_id = '${card.id}'
		`)
			.get();

		if (row === undefined) return card;

		return new Card(
			card.question,
			card.answer,
			Schedule.parse(
				row.consecutive_successes,
				row.memory_strength,
				row.review_interval_days,
				row.reviewed_on,
			),
		);
	}
}
