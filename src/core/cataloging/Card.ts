import { createHash } from "node:crypto";
import type { Grade } from "../scheduling/Grade.js";
import { Schedule } from "../scheduling/Schedule.js";

export class Card {
	public readonly id: string;

	public constructor(
		public readonly question: string,
		public readonly answer: string,
		private schedule: Schedule | null = null,
	) {
		Card.validateQuestion(question);
		Card.validateAnswer(answer);
		this.id = this.contentBasedId(`${question}${answer}`);
	}

	public isDueForReview(): boolean {
		if (this.schedule === null) return true;
		return this.schedule.isDueForReview();
	}

	public getSchedule(): Schedule {
		return this.schedule ?? Schedule.forNewCard();
	}

	public addSchedule(newSchedule: Schedule): void {
		if (this.schedule) throw new Error("Card already scheduled.");
		this.schedule = newSchedule;
	}

	public selfEvaluate(grade: Grade): void {
		const currentSchedule = this.schedule ?? Schedule.forNewCard();
		this.schedule = currentSchedule.recalculateAfterReview(grade);
	}

	private static validateQuestion(question: string): void {
		if (!question.trim()) throw new Error("Question cannot be blank.");
	}

	private static validateAnswer(answer: string): void {
		if (!answer.trim()) throw new Error("Answer cannot be blank.");
	}

	private contentBasedId(content: string): string {
		return createHash("sha1").update(content).digest("hex").slice(0, 8);
	}
}
