import type { Topic } from "../core/cataloging/Topic.js";

export function renderTopicTree(topic: Topic): string {
	return renderTopicTreeNode(topic, "ROOT", "");
}

function renderTopicTreeNode(topic: Topic, nodeType: TopicNodeType, indent: string): string {
	const connector = CONNECTORS[nodeType];
	const topicLine = `${indent}${connector.symbol}${topic.name} ${topicStats(topic)}`;

	const nextIndent = indent + connector.childIndent;
	const lastIndex = topic.amountOfSubtopics - 1;

	const childLines = topic.subtopics.map((subtopic, i) =>
		renderTopicTreeNode(subtopic, i === lastIndex ? "LEAF" : "BRANCH", nextIndent),
	);

	return [topicLine, ...childLines].join("\n");
}

function topicStats(topic: Topic): string {
	const total = topic.totalAmountOfCards;
	const due = topic.amountOfCardsDueForReview();
	const cardWord = total === 1 ? "card" : "cards";
	const dueText = due === 0 ? "done" : `${due} due`;
	return `(${total} ${cardWord}: ${dueText})`;
}

type TopicNodeType = "ROOT" | "BRANCH" | "LEAF";

type Connector = { readonly symbol: string; readonly childIndent: string };

const CONNECTORS = {
	ROOT: { symbol: "", childIndent: "" },
	BRANCH: { symbol: "├── ", childIndent: "│   " },
	LEAF: { symbol: "└── ", childIndent: "    " },
} as const satisfies Record<TopicNodeType, Connector>;
