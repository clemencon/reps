import type { Topic } from "./Topic.js";

export interface Catalog {
	getTopicTree(): Topic;
}
