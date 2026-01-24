import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { FileSystemLibrary } from "../../src/app/FileSystemLibrary.js";
import { Card } from "../../src/core/Card.js";
import { Schedule } from "../../src/core/Schedule.js";
import type { ScheduleTracker } from "../../src/core/ScheduleTracker.js";
import type { Topic } from "../../src/core/Topic.js";

describe("FileSystemLibrary", () => {
	let temporaryLibraryPath: string | undefined;

	beforeEach(() => {
		temporaryLibraryPath = undefined;
	});

	afterEach(() => {
		if (temporaryLibraryPath) rmSync(temporaryLibraryPath, { recursive: true, force: true });
	});

	test("builds the a topic tree from the library directory", () => {
		const scheduleTracker = createScheduleTracker(Schedule.forNewCard());
		const library = new FileSystemLibrary(exampleLibraryPath, scheduleTracker.tracker);

		const topicTree = library.getTopicTree();

		expect(topicTree.name).toBe("example-library");
		expect(topicTree.deck.cards).toHaveLength(0);
		const cleanCode = findSubtopic(topicTree, "clean-code");
		const errorHandling = findSubtopic(topicTree, "error-handling");
		expectDeckMatches(cleanCode.deck, cleanCodeCards);
		expect(cleanCode.containsSubtopics).toBe(true);
		const refactoring = findSubtopic(cleanCode, "refactoring");
		expectDeckMatches(refactoring.deck, refactoringCards);
		expect(errorHandling.containsSubtopics).toBe(false);
		expectDeckMatches(errorHandling.deck, errorHandlingCards);
	});

	test("applies the schedules from the schedule tracker", () => {
		const schedule = Schedule.parse(1, 2.2, 3, "2020-01-01T00:00:00.000Z");
		const scheduleTracker = createScheduleTracker(schedule);
		const library = new FileSystemLibrary(exampleLibraryPath, scheduleTracker.tracker);

		const topicTree = library.getTopicTree();
		const cleanCode = findSubtopic(topicTree, "clean-code");
		const targetCard = findCardByQuestion(cleanCode, getFirstCardQuestion(cleanCodeCards));
		expect(targetCard.getSchedule()).toBe(schedule);
		expect(scheduleTracker.get).toHaveBeenCalledWith(
			new Card(targetCard.question, targetCard.answer),
		);
	});

	test("throws an error when a card is missing the separator", () => {
		const scheduleTracker = createScheduleTracker(Schedule.forNewCard());
		const tempDir = mkdtempSync(join(tmpdir(), "reps-library-"));
		temporaryLibraryPath = tempDir;
		const filePath = join(tempDir, "invalid.txt");
		writeFileSync(filePath, "Question without separator");
		const library = new FileSystemLibrary(tempDir, scheduleTracker.tracker);

		expect(() => library.getTopicTree()).toThrow(
			"Card file invalid.txt must contain question and answer separated by '???'.",
		);
	});

	test("throws an error when the library path is not a directory", () => {
		const scheduleTracker = createScheduleTracker(Schedule.forNewCard());
		const missingPath = join(tmpdir(), "reps-missing-library");
		const library = new FileSystemLibrary(missingPath, scheduleTracker.tracker);

		expect(() => library.getTopicTree()).toThrow(
			`Library path ${missingPath} must be an existing directory.`,
		);
	});

	test("throws an error when the library path is a file", () => {
		const scheduleTracker = createScheduleTracker(Schedule.forNewCard());
		const tempDir = mkdtempSync(join(tmpdir(), "reps-library-"));
		temporaryLibraryPath = tempDir;
		const filePath = join(tempDir, "not-a-directory.txt");
		writeFileSync(filePath, "Not a directory");
		const library = new FileSystemLibrary(filePath, scheduleTracker.tracker);

		expect(() => library.getTopicTree()).toThrow(
			`Library path ${filePath} must be an existing directory.`,
		);
	});
});

const exampleLibraryPath = join(process.cwd(), "tests", "example-library");

const cleanCodeCards = [
	{
		question: 'What makes a function name "clean" and easy to understand?',
		answer:
			"A clean function name should clearly express what the function does using descriptive verbs and nouns, avoiding abbreviations and ambiguous terms.",
	},
	{
		question: "What is the key principle for keeping functions clean and maintainable?",
		answer:
			"Functions should do one thing well and have a single reason to change, making them easier to understand, test, and modify.",
	},
] as const;

const refactoringCards = [
	{
		question: "What are the three main categories of code smells according to Martin Fowler?",
		answer:
			"Bloaters (code that has grown too large), Object-Orientation Abusers (incomplete or incorrect application of OOP principles), and Change Preventers (code that makes changes difficult).",
	},
] as const;

const errorHandlingCards = [
	{
		question:
			'What is the key strategy for simplifying exception handling according to Ousterhout\'s "define errors out of existence" approach?',
		answer:
			"Reduce the number of places where exceptions must be handled by modifying operation semantics so that normal behavior handles all situations without exceptional conditions.",
	},
	{
		question:
			"Why does exception handling code contribute disproportionately to complexity in software systems?",
		answer:
			"Exception handling code is inherently more difficult to write than normal-case code because it disrupts normal flow and often creates opportunities for additional exceptions during recovery.",
	},
	{
		question: "What makes exception handling code particularly unreliable in production systems?",
		answer:
			"Exception handling code rarely executes in running systems and is difficult to test, so bugs often go undetected until the code is actually needed and then frequently fails to work properly.",
	},
] as const;

function createScheduleTracker(schedule: Schedule): {
	tracker: ScheduleTracker;
	get: ReturnType<typeof vi.fn>;
} {
	const get = vi.fn<ScheduleTracker["get"]>(() => schedule);
	const store = vi.fn<ScheduleTracker["store"]>(() => {});
	return { tracker: { get, store }, get };
}

function getFirstCardQuestion(cards: ReadonlyArray<{ question: string; answer: string }>): string {
	const [firstCard] = cards;
	if (!firstCard) throw new Error("Expected at least one card in the fixture.");
	return firstCard.question;
}

function findSubtopic(topic: Topic, name: string): Topic {
	const match = topic.subtopics.find((subtopic) => subtopic.name === name);
	if (!match) throw new Error(`Expected to find subtopic ${name}.`);
	return match;
}

function findCardByQuestion(topic: Topic, question: string): Card {
	const card = topic.deck.cards.find((entry) => entry.question === question);
	if (!card) throw new Error(`Expected to find card with question ${question}.`);
	return card;
}

function expectDeckMatches(
	deck: { cards: ReadonlyArray<Card> },
	expected: ReadonlyArray<{ question: string; answer: string }>,
): void {
	const actualQuestions = deck.cards.map((card) => `${card.question}::${card.answer}`).sort();
	const expectedQuestions = expected.map((card) => `${card.question}::${card.answer}`).sort();
	expect(actualQuestions).toEqual(expectedQuestions);
}
