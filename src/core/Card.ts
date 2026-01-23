import { createHash } from "node:crypto";
import type { Grade } from "./Grade.js";
import { Schedule } from "./Schedule.js";

export class Card {
	public readonly id: string;

	public constructor(
		public readonly question: string,
		public readonly answer: string,
		public readonly schedule: Schedule | null = null,
	) {
		Card.validateQuestion(question);
		Card.validateAnswer(answer);
		this.id = this.contentBasedId();
	}

	public isDueForReview(): boolean {
		if (this.schedule === null) return true;
		return this.schedule.isDueForReview();
	}

	public selfEvaluate(grade: Grade): Card {
		const currentSchedule = this.schedule ?? Schedule.forNewCard();
		const newSchedule = currentSchedule.recalculateAfterReview(grade);
		return new Card(this.question, this.answer, newSchedule);
	}

	private static validateQuestion(question: string): void {
		if (!question.trim()) throw new Error("Question cannot be blank.");
	}

	private static validateAnswer(answer: string): void {
		if (!answer.trim()) throw new Error("Answer cannot be blank.");
	}

	private contentBasedId(): string {
		return createHash("sha1").update(`${this.question}${this.answer}`).digest("hex").slice(0, 8);
	}
}
