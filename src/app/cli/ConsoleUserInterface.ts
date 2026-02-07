import { search } from "@inquirer/prompts";
import dedent from "dedent";
import type { Topic } from "../../core/cataloging/Topic.js";
import type { UserInterface } from "../UserInterface.js";
import { renderTopicTree } from "./TextRenderer.js";

export class ConsoleUserInterface implements UserInterface {
	public async requestTopicForReview(catalog: Topic): Promise<Topic> {
		const userPrompt = dedent`
			Let's go, here is your topic tree:\n
			${renderTopicTree(catalog)}\n
			Pick a topic to review:
		`;

		return await search({
			message: userPrompt,
			source: async (userInput) => {
				return catalog
					.listAllTopics()
					.filter((topic) => topic.name.includes(userInput ?? ""))
					.map((topic) => ({ name: topic.name, value: topic }));
			},
		});
	}
}
