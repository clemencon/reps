import { confirm, search, select } from "@inquirer/prompts";
import type { Card } from "../../core/cataloging/Card.js";
import type { Topic } from "../../core/cataloging/Topic.js";
import { Grade } from "../../core/scheduling/Grade.js";
import type { UserInterface } from "../UserInterface.js";
import { TextRenderer } from "./TextRenderer.js";

export class ConsoleUserInterface implements UserInterface {
	private readonly textRenderer: TextRenderer = new TextRenderer();

	public async requestTopicForReview(catalog: Topic): Promise<Topic> {
		return await search({
			message: this.textRenderer.renderTopicTree(catalog),
			source: async (userInput) => {
				return catalog
					.listAllTopics()
					.filter((topic) => topic.name.includes(userInput ?? ""))
					.map((topic) => ({ name: topic.name, value: topic }));
			},
		});
	}

	public async letStudentSelfEvaluate(card: Card): Promise<Grade> {
		let showAnswer = false;
		while (!showAnswer) {
			showAnswer = await confirm({
				message: this.textRenderer.renderQuestion(card),
				default: true,
			});
		}

		// Inquirer select only supports 1-based number keys,
		// so the prompt displays grades as 1–6,
		// while the underlying values map to SM-2 grades 0–5.
		const selectedGrade = await select({
			message: this.textRenderer.renderAnswer(card),
			choices: this.textRenderer.gradeChoices(),
			theme: { indexMode: "number" },
		});

		return new Grade(selectedGrade);
	}
}
