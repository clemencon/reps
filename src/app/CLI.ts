import { select } from "@inquirer/prompts";

const ALL_CARDS = "all cards";
const SPECIFIC_TOPIC = "specific topic";

export const reviewPromptConfig = {
	message: "Ready to review?",
	choices: [
		{ name: "All cards", value: ALL_CARDS },
		{ name: "Specific topic", value: SPECIFIC_TOPIC },
	],
} as const;

export class CLI {
	public async run(): Promise<void> {
		const action = await select(reviewPromptConfig);

		switch (action) {
			case ALL_CARDS:
				console.log("Starting review session...");
				return;
			case SPECIFIC_TOPIC:
				console.log("See you next time!");
				return;
			default:
				console.log("Unknown action.");
				return;
		}
	}
}
