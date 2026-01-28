import type { Topic } from "../core/cataloging/Topic.js";

type NodeType = "ROOT" | "BRANCH" | "LEAF";

const CONNECTORS: Record<NodeType, { current: string; next: string }> = {
	ROOT: { current: "", next: "" },
	BRANCH: { current: "├── ", next: "│   " },
	LEAF: { current: "└── ", next: "    " },
};

export function renderTopicTree(topic: Topic): string {
	return renderNode(topic, "ROOT", "");
}

function renderNode(topic: Topic, nodeType: NodeType, connectorPrefix: string): string {
	const connector = CONNECTORS[nodeType];
	const lines: string[] = [connectorPrefix + connector.current + topic.name];

	const nextPrefix = connectorPrefix + connector.next;
	const subtopics = topic.subtopics;
	const lastIndex = subtopics.length - 1;

	for (const [i, subtopic] of subtopics.entries()) {
		const childNodeType: NodeType = i === lastIndex ? "LEAF" : "BRANCH";
		lines.push(renderNode(subtopic, childNodeType, nextPrefix));
	}

	return lines.join("\n");
}
