import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";

import { Card } from "../../core/cataloging/Card.js";
import type { Catalog } from "../../core/cataloging/Catalog.js";
import { Deck } from "../../core/cataloging/Deck.js";
import { Topic } from "../../core/cataloging/Topic.js";
import type { ScheduleTracker } from "../../core/scheduling/ScheduleTracker.js";

export class FileSystemCatalog implements Catalog {
	private static CARD_FILE_EXTENSIONS = new Set([".md", ".txt"]);
	private static CARD_SEPARATOR = "???"; // ju: Move to config.

	public constructor(
		private readonly catalogPath: string,
		private readonly scheduleTracker: ScheduleTracker,
	) {
		this.ensureDirectoryExists(this.catalogPath);
	}

	public getTopicTree(): Topic {
		return this.buildTopicTree(this.catalogPath);
	}

	public store(card: Card): void {
		this.scheduleTracker.store(card);
	}

	private buildTopicTree(path: string): Topic {
		const entries = readdirSync(path, { withFileTypes: true });

		const subtopics = entries
			.filter((entry) => entry.isDirectory())
			.map((subdirectory) => join(path, subdirectory.name))
			.map((subDirectoryPath) => this.buildTopicTree(subDirectoryPath));

		const cards = entries
			.filter((entry) => entry.isFile())
			.map((file) => join(path, file.name))
			.filter((filePath) => this.isCardFile(filePath))
			.map((filePath) => this.parseToCard(filePath));

		return new Topic(basename(path), new Deck(...cards), subtopics);
	}

	private isCardFile(filePath: string): boolean {
		return FileSystemCatalog.CARD_FILE_EXTENSIONS.has(extname(filePath).toLowerCase());
	}

	private parseToCard(filePath: string): Card {
		const { question, answer } = this.parseCardContent(filePath);
		const preScheduleCard = new Card(question, answer);
		const schedule = this.scheduleTracker.get(preScheduleCard);
		return new Card(question, answer, schedule);
	}

	private parseCardContent(filePath: string): { question: string; answer: string } {
		const content = readFileSync(filePath, "utf-8").trimEnd();
		const separatorIndex = content.indexOf(FileSystemCatalog.CARD_SEPARATOR);
		const separatorIsMissing = separatorIndex === -1;
		if (separatorIsMissing) {
			const message = `Card file ${basename(filePath)} must contain question and answer separated by '${FileSystemCatalog.CARD_SEPARATOR}'.`;
			throw new Error(message);
		}
		const question = content.slice(0, separatorIndex).trim();
		const answer = content.slice(separatorIndex + FileSystemCatalog.CARD_SEPARATOR.length).trim();
		return { question, answer };
	}

	private ensureDirectoryExists(path: string): void {
		if (!existsSync(path)) {
			mkdirSync(path, { recursive: true });
		}
		if (!statSync(path).isDirectory()) {
			throw new Error(`Catalog path ${path} must be an existing directory.`);
		}
	}
}
