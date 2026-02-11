import dedent from "dedent";
import type { Card } from "../../core/cataloging/Card.js";
import type { Topic } from "../../core/cataloging/Topic.js";

export class TextRenderer {
	private static readonly CONNECTORS = {
		ROOT: { symbol: "", childIndent: "" },
		BRANCH: { symbol: "├── ", childIndent: "│   " },
		LEAF: { symbol: "└── ", childIndent: "    " },
	} as const;

	public renderTopicTree(topic: Topic): string {
		return dedent`
			Let's go, here is your topic tree:
				
			${this.renderTopicTreeNode(topic, "ROOT", "")}
		   
			Pick a topic to review:
		`;
	}

	public renderQuestion(card: Card): string {
		return dedent`
			Question:
			${card.question}
			
			Show answer? (Y/n)
		`;
	}

	public renderAnswer(card: Card) {
		return dedent`
			Answer:
			${card.answer}
		
			Self-evaluation:
		`;
	}

	// ju: Good location? Use real grade values? How to test?
	public gradeChoices(): { name: string; value: number }[] {
		return [
			{ name: "Total blackout", value: 0 },
			{
				name: "Incorrect response, but upon seeing the correct answer it felt familiar.",
				value: 1,
			},
			{
				name: "Incorrect response, but upon seeing the correct answer it seemed easy to remember.",
				value: 2,
			},
			{ name: "Correct response, but required significant effort to recall.", value: 3 },
			{ name: "Correct response, after some hesitation.", value: 4 },
			{ name: "Correct response with perfect recall.", value: 5 },
		];
	}

	private renderTopicTreeNode(topic: Topic, nodeType: TopicNodeType, indent: string): string {
		const connector = TextRenderer.CONNECTORS[nodeType];
		const topicLine = `${indent}${connector.symbol}${topic.name} ${this.topicStats(topic)}`;

		const nextIndent = indent + connector.childIndent;
		const lastIndex = topic.amountOfSubtopics - 1;

		const childLines = topic.subtopics.map((subtopic, i) =>
			this.renderTopicTreeNode(subtopic, i === lastIndex ? "LEAF" : "BRANCH", nextIndent),
		);

		return [topicLine, ...childLines].join("\n");
	}

	private topicStats(topic: Topic): string {
		const total = topic.totalAmountOfCards;
		const due = topic.amountOfCardsDueForReview();
		const cardWord = total === 1 ? "card" : "cards";
		const dueText = due === 0 ? "done" : `${due} due`;
		return `(${total} ${cardWord}: ${dueText})`;
	}
}

type TopicNodeType = "ROOT" | "BRANCH" | "LEAF";
