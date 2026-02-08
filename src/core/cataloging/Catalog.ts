import type { Card } from "./Card.js";
import type { Topic } from "./Topic.js";

export interface Catalog {
	getTopicTree(): Topic;
	store(card: Card): void;
}
