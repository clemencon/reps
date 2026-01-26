import { faker } from "@faker-js/faker/locale/en";
import { Card } from "../../../src/core/cataloging/Card.js";
import { Schedule } from "../../../src/core/scheduling/Schedule.js";

export class CardBuilder {
	public build(): Card {
		const question = faker.lorem.sentence();
		const answer = faker.lorem.sentence();
		const schedule = Schedule.forNewCard();
		return new Card(question, answer, schedule);
	}
}
