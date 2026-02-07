import type { Catalog } from "../core/cataloging/Catalog.js";
import type { Topic } from "../core/cataloging/Topic.js";
import type { UserInterface } from "./UserInterface.js";

export class Reps {
	public constructor(
		public readonly catalog: Catalog,
		public readonly userInterface: UserInterface,
	) {}
	public async run(): Promise<void> {
		const catalog: Topic = this.catalog.getTopicTree();
		const topicToReview = await this.userInterface.requestTopicForReview(catalog);
		const reviewDeck = topicToReview.assembleReviewDeck();
		reviewDeck.shuffle();
		// For each card:
		// Show the question to the user and ask if the user is ready to view the answer.
		// Let the user self-review.
		// Mark the card as reviewed.
		// Store the new schedule for the card or the reviewed card.
		// Show a message with the topic tree for the next round (new topic).
		// Or show a message when all cards in the catalog are reviewed.
	}
}
