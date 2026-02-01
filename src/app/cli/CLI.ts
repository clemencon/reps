import { Deck } from "../../core/cataloging/Deck.js";
import { Topic } from "../../core/cataloging/Topic.js";
import type { UserInterface } from "../UserInterface.js";
import { renderTopicTree } from "./TextRenderer.js";

export class CLI implements UserInterface {
	public requestTopicForReview(catalog: Topic): Topic {
		const topicTree = renderTopicTree(catalog);
		console.log(topicTree);
		return new Topic("To implement", new Deck());
	}
}
