import dedent from "dedent";
import { describe, expect, test } from "vitest";
import { renderTopicTree } from "../../src/app/TextRenderer.js";
import { TopicBuilder } from "../core/cataloging/TopicBuilder.js";

describe("TextRenderer", () => {
	test("creates a text representation of a topic tree", () => {
		const refactoring = new TopicBuilder().withName("refactoring").build();
		const errorHandling = new TopicBuilder().withName("error-handling").build();
		const cleanCode = new TopicBuilder().withName("clean-code");

		const catalog = new TopicBuilder()
			.withName("catalog")
			.withSubtopics(cleanCode.withSubtopics(refactoring).build(), errorHandling)
			.build();

		const renderedTopicTree = renderTopicTree(catalog);

		expect(renderedTopicTree).toBe(dedent`
			catalog
			├── clean-code
			│   └── refactoring
			└── error-handling
		`);
	});
});
