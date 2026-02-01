import type { Catalog } from "../core/cataloging/Catalog.js";
import { Deck } from "../core/cataloging/Deck.js";
import { Topic } from "../core/cataloging/Topic.js";
import type { UserInterface } from "./UserInterface.js";

export class Reps {
	public constructor(
		public readonly catalog: Catalog,
		public readonly userInterface: UserInterface,
	) {}
	public run(): void {
		const catalog: Topic = new Topic("To implement", new Deck());
		this.userInterface.requestTopicForReview(catalog);
	}
}
