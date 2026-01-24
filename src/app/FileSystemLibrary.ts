import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { Card } from "../core/Card.js";
import { Deck } from "../core/Deck.js";
import type { Library } from "../core/Library.js";
import type { ScheduleTracker } from "../core/ScheduleTracker.js";
import { Topic } from "../core/Topic.js";

export class FileSystemLibrary implements Library {
	private static CARD_FILE_EXTENSIONS = new Set([".md", ".txt"]);
	private static CARD_SEPARATOR = "???"; // ju: Move to config.

	public constructor(
		private readonly libraryPath: string,
		private readonly scheduleTracker: ScheduleTracker,
	) {}

	public getTopicTree(): Topic {
		this.ensureDirectoryExists(this.libraryPath);
		return this.buildTopicTree(this.libraryPath);
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
		return FileSystemLibrary.CARD_FILE_EXTENSIONS.has(extname(filePath).toLowerCase());
	}

	private parseToCard(filePath: string): Card {
		const { question, answer } = this.parseCardContent(filePath);
		const preScheduleCard = new Card(question, answer);
		const schedule = this.scheduleTracker.get(preScheduleCard);
		return new Card(question, answer, schedule);
	}

	private parseCardContent(filePath: string): { question: string; answer: string } {
		const content = readFileSync(filePath, "utf-8").trimEnd();
		const separatorIndex = content.indexOf(FileSystemLibrary.CARD_SEPARATOR);
		const separatorIsMissing = separatorIndex === -1;
		if (separatorIsMissing) {
			const message = `Card file ${basename(filePath)} must contain question and answer separated by '${FileSystemLibrary.CARD_SEPARATOR}'.`;
			throw new Error(message);
		}
		const question = content.slice(0, separatorIndex).trim();
		const answer = content.slice(separatorIndex + FileSystemLibrary.CARD_SEPARATOR.length).trim();
		return { question, answer };
	}

	private ensureDirectoryExists(path: string): void {
		try {
			if (!statSync(path).isDirectory()) throw new Error();
		} catch {
			throw new Error(`Library path ${path} must be an existing directory.`);
		}
	}
}
