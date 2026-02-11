import { faker } from "@faker-js/faker/locale/en";
import { Card } from "../../../src/core/cataloging/Card.js";
import { Schedule } from "../../../src/core/scheduling/Schedule.js";
import { ScheduleBuilder } from "../scheduling/ScheduleBuilder.js";

export class CardBuilder {
	private question: string;
	private answer: string;
	private schedule: Schedule;

	public constructor() {
		this.question = faker.lorem.sentence();
		this.answer = faker.lorem.sentence();
		this.schedule = Schedule.forNewCard();
	}

	public withQuestion(question: string): CardBuilder {
		this.question = question;
		return this;
	}

	public withAnswer(answer: string): CardBuilder {
		this.answer = answer;
		return this;
	}

	public dueForReview(): CardBuilder {
		this.schedule = new ScheduleBuilder().due().build();
		return this;
	}

	public notDueForReview(): CardBuilder {
		this.schedule = new ScheduleBuilder().notDue().build();
		return this;
	}

	public build(): Card {
		return new Card(this.question, this.answer, this.schedule);
	}
}
