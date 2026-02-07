import type { Topic } from "../core/cataloging/Topic.js";

export interface UserInterface {
	requestTopicForReview(catalog: Topic): Promise<Topic>;
	// reviewCard(card: Card): Grade;
}
