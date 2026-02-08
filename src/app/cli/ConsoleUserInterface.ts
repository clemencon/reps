import { confirm, search, select } from "@inquirer/prompts";
import dedent from "dedent";
import type { Card } from "../../core/cataloging/Card.js";
import type { Topic } from "../../core/cataloging/Topic.js";
import { Grade } from "../../core/scheduling/Grade.js";
import type { UserInterface } from "../UserInterface.js";
import { renderTopicTree } from "./TextRenderer.js";

// ju: Clean up the methods.
export class ConsoleUserInterface implements UserInterface {
	public async requestTopicForReview(catalog: Topic): Promise<Topic> {
		const message = dedent`
			Let's go, here is your topic tree:\n
			${renderTopicTree(catalog)}\n
			Pick a topic to review:
		`;

		return await search({
			message: message,
			source: async (userInput) => {
				return catalog
					.listAllTopics()
					.filter((topic) => topic.name.includes(userInput ?? ""))
					.map((topic) => ({ name: topic.name, value: topic }));
			},
		});
	}

	public async letStudentSelfEvaluate(card: Card): Promise<Grade> {
		const questionMessage = dedent`
			Question:
			${card.question}
			
			Show answer? (Y/n)
		`;
		let showAnswer = false;
		while (!showAnswer) {
			showAnswer = await confirm({ message: questionMessage, default: true });
		}

		const answerMessage = dedent`
			Answer:
			${card.answer}
		
			Self-evaluation:
		`;
		// @inquirer/select only supports 1-based number keys,
		// so the prompt displays grades as 1–6 while the underlying values map to SM-2 grades 0–5.
		const gradeChoices = [
			{ name: "Total blackout", value: 0 },
			{
				name: "Incorrect response, but upon seeing the correct answer it felt familiar.",
				value: 1,
			},
			{
				name: "Incorrect response, but upon seeing the correct answer it seemed easy to remember.",
				value: 2,
			},
			{ name: "Correct response, but required significant effort to recall.", value: 3 },
			{ name: "Correct response, after some hesitation.", value: 4 },
			{ name: "Correct response with perfect recall.", value: 5 },
		];

		const selectedGrade = await select({
			message: answerMessage,
			choices: gradeChoices,
			theme: { indexMode: "number" },
		});

		return new Grade(selectedGrade);
	}
}
