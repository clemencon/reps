import { faker } from "@faker-js/faker/locale/en";
import { Card } from "../../../src/core/cataloging/Card.js";
import { Schedule } from "../../../src/core/scheduling/Schedule.js";
import { ScheduleBuilder } from "../scheduling/ScheduleBuilder.js";

export class CardBuilder {
	private schedule = Schedule.forNewCard();

	public dueForReview(): CardBuilder {
		this.schedule = new ScheduleBuilder().due().build();
		return this;
	}

	public notDueForReview(): CardBuilder {
		this.schedule = new ScheduleBuilder().notDue().build();
		return this;
	}

	public build(): Card {
		const question = faker.lorem.sentence();
		const answer = faker.lorem.sentence();
		return new Card(question, answer, this.schedule);
	}
}
