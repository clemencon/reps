import { faker } from "@faker-js/faker/locale/en";
import { Topic } from "../../../src/core/cataloging/Topic.js";
import { DeckBuilder } from "./DeckBuilder.js";

export class TopicBuilder {
	private name = faker.lorem.word();
	private deck = new DeckBuilder().withCards(3).build();
	private subtopics: Topic[] = [];

	public withName(name: string): TopicBuilder {
		this.name = name;
		return this;
	}

	public withSubtopics(...subtopics: Topic[]): TopicBuilder {
		this.subtopics.push(...subtopics);
		return this;
	}

	public build(): Topic {
		return new Topic(this.name, this.deck, this.subtopics);
	}
}
