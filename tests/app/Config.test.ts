import { vol } from "memfs";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { Config } from "../../src/app/persistence/Config.js";

vi.mock("node:fs", async () => {
	const memfs = await import("memfs");
	return memfs.fs;
});

describe("Config", () => {
	beforeEach(() => vol.reset());

	describe("configuration loading", () => {
		test("missing config file is created with default paths", () => {
			Config.load();
			const createdConfigFile = readFile("~/.config/reps.json");

			expect(JSON.parse(createdConfigFile)).toEqual({
				catalogPath: "~/reps",
				databasePath: "~/.local/share/reps/schedule.sqlite",
			});
		});

		test("config file values override defaults", () => {
			writeFile("~/.config/reps.json", {
				catalogPath: "/custom/catalog",
				databasePath: "/custom/database.sqlite",
			});

			const config = Config.load();

			expect(config.catalogPath).toBe("/custom/catalog");
			expect(config.databasePath).toBe("/custom/database.sqlite");
		});

		test("missing catalogPath in config uses default while databasePath is read from file", () => {
			writeFile("~/.config/reps.json", {
				databasePath: "/custom/database.sqlite",
			});

			const config = Config.load();

			expect(config.catalogPath).toBe("~/reps");
			expect(config.databasePath).toBe("/custom/database.sqlite");
		});

		test("missing databasePath in config uses default while catalogPath is read from file", () => {
			writeFile("~/.config/reps.json", {
				catalogPath: "/custom/catalog",
			});

			const config = Config.load();

			expect(config.catalogPath).toBe("/custom/catalog");
			expect(config.databasePath).toBe("~/.local/share/reps/schedule.sqlite");
		});

		test("malformed JSON throws error with file path", () => {
			writeMalformedFile("~/.config/reps.json", "{ invalid json");

			expect(() => Config.load()).toThrow(
				"Failed to read the configuration file ~/.config/reps.json: invalid JSON syntax.",
			);
		});

		test("custom catalog path overrides default location", () => {
			writeFile("~/.config/reps.json", { catalogPath: "/custom/catalog" });
			const config = Config.load();
			expect(config.catalogPath).toBe("/custom/catalog");
		});

		test("custom database path overrides default location", () => {
			writeFile("~/.config/reps.json", { databasePath: "/custom/database.sqlite" });
			const config = Config.load();
			expect(config.databasePath).toBe("/custom/database.sqlite");
		});
	});

	describe("path expansion", () => {
		test("tilde-slash prefix resolves to home directory", () => {});

		test("absolute paths are not modified", () => {});
	});

	describe("validation", () => {
		test("empty string catalogPath throws validation error", () => {});

		test("empty string databasePath throws validation error", () => {});
	});
});

function writeFile(path: string, content: unknown): void {
	vol.fromJSON({ [path]: JSON.stringify(content) });
}

function writeMalformedFile(path: string, content: string): void {
	vol.fromJSON({ [path]: content });
}

function readFile(path: string): string {
	// ju: Return json instead.
	return vol.readFileSync(path, "utf-8").toString();
}
