import { render } from "@inquirer/testing";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// ju: Remove after testing.

describe("CLI prompt", () => {
	beforeEach(() => {
		vi.resetModules();
		vi.doUnmock("@inquirer/prompts");
	});

	test("selects review by default", async () => {
		const { select } = await import("@inquirer/prompts");
		const { reviewPromptConfig } = await import("../../src/app/CLI.js");
		const { answer, events, getScreen } = await render(select, reviewPromptConfig);

		expect(getScreen()).toContain("Ready to review?");
		expect(getScreen()).toContain("All cards");

		events.keypress("enter");

		await expect(answer).resolves.toEqual("all cards");
	});

	test("selects exit when navigating down", async () => {
		const { select } = await import("@inquirer/prompts");
		const { reviewPromptConfig } = await import("../../src/app/CLI.js");
		const { answer, events, getScreen } = await render(select, reviewPromptConfig);

		expect(getScreen()).toContain("Specific topic");

		events.keypress("down");
		events.keypress("enter");

		await expect(answer).resolves.toEqual("specific topic");
	});
});

describe("CLI run", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.resetModules();
	});

	test("logs when selecting all cards", async () => {
		const select = vi.fn().mockResolvedValue("all cards");
		const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

		vi.doMock("@inquirer/prompts", () => ({ select }));
		const { CLI } = await import("../../src/app/CLI.js");

		await new CLI().run();

		expect(select).toHaveBeenCalledWith(expect.objectContaining({ message: "Ready to review?" }));
		expect(logSpy).toHaveBeenCalledWith("Starting review session...");
	});

	test("logs when selecting specific topic", async () => {
		const select = vi.fn().mockResolvedValue("specific topic");
		const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

		vi.doMock("@inquirer/prompts", () => ({ select }));
		const { CLI } = await import("../../src/app/CLI.js");

		await new CLI().run();

		expect(logSpy).toHaveBeenCalledWith("See you next time!");
	});

	test("logs when selection is unknown", async () => {
		const select = vi.fn().mockResolvedValue("mystery");
		const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

		vi.doMock("@inquirer/prompts", () => ({ select }));
		const { CLI } = await import("../../src/app/CLI.js");

		await new CLI().run();

		expect(logSpy).toHaveBeenCalledWith("Unknown action.");
	});
});
