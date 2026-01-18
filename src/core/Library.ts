import type { Topic } from "./Topic.js";

export interface Library {
	getTopicTree(): Topic;
}
