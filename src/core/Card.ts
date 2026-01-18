export class Card {
	public constructor(
		public readonly question: string,
		public readonly answer: string,
	) {
		Card.validateQuestion(question);
		Card.validateAnswer(answer);
	}

	private static validateQuestion(question: string): void {
		if (!question.trim()) throw new Error("Question cannot be blank.");
	}

	private static validateAnswer(answer: string): void {
		if (!answer.trim()) throw new Error("Answer cannot be blank.");
	}
}
