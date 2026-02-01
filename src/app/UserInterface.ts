import type { Topic } from "../core/cataloging/Topic.js";

export interface UserInterface {
	requestTopicForReview(catalog: Topic): Topic;
	// reviewCard(card: Card): Grade;
}
