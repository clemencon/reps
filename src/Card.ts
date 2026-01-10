export class Card {
	constructor(
		readonly question: string,
		readonly answer: string,
	) {
		if (!question.trim()) throw new Error("Question cannot be blank.");
		if (!answer.trim()) throw new Error("Answer cannot be blank.");
	}
}
