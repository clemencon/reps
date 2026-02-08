import type { Catalog } from "../core/cataloging/Catalog.js";
import type { Topic } from "../core/cataloging/Topic.js";
import type { Grade } from "../core/scheduling/Grade.js";
import type { UserInterface } from "./UserInterface.js";

export class Reps {
	public constructor(
		public readonly catalog: Catalog,
		public readonly userInterface: UserInterface,
	) {}
	public async run(): Promise<void> {
		const topicTree: Topic = this.catalog.getTopicTree();
		const topicToReview = await this.userInterface.requestTopicForReview(topicTree);
		const reviewDeck = topicToReview.assembleReviewDeck().shuffle();
		for (const card of reviewDeck) {
			const grade: Grade = await this.userInterface.letStudentSelfEvaluate(card);
			card.selfEvaluate(grade);
			this.catalog.store(card);
		}
		// Show a message with the topic tree for the next round (new topic).
		// Or show a message when all cards in the catalog are reviewed.
	}
}
