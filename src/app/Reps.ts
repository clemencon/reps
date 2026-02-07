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
		await this.userInterface.requestTopicForReview(catalog);
	}
}
