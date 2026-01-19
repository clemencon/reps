import { createHash } from "node:crypto";

export class Card {
	public readonly id: string;

	public constructor(
		public readonly question: string,
		public readonly answer: string,
	) {
		Card.validateQuestion(question);
		Card.validateAnswer(answer);
		this.id = this.contentBasedId();
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
