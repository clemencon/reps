import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname } from "node:path";
import type { Config } from "../Config.js";

export class JsonConfig implements Config {
	private static readonly DEFAULT_CONFIG_PATH = "~/.config/reps.json";
	private static readonly DEFAULT_CATALOG_PATH = "~/reps";
	private static readonly DEFAULT_DATABASE_PATH = "~/.local/share/reps/schedule.sqlite";
	private static readonly DEFAULT_CARD_SEPARATOR = "???";

	private constructor(
		public readonly catalogPath: string,
		public readonly databasePath: string,
		public readonly cardSeparator: string,
	) {}

	public static load(): Config {
		const path = JsonConfig.pathToFile();
		if (!JsonConfig.fileExists(path)) JsonConfig.writeDefaultFile(path);
		return JsonConfig.parseFile(path);
	}

	private static pathToFile(): string {
		const path = process.env["REPS_CONFIG_PATH"] ?? JsonConfig.DEFAULT_CONFIG_PATH; // ju: Move.
		return JsonConfig.expanded(path);
	}

	private static parseFile(path: string): JsonConfig {
		try {
			const fileContent = readFileSync(path, "utf-8");
			const parsed = JSON.parse(fileContent);
			const catalogPath = JsonConfig.expanded(
				parsed.catalogPath ?? JsonConfig.DEFAULT_CATALOG_PATH,
			);
			const databasePath = JsonConfig.expanded(
				parsed.databasePath ?? JsonConfig.DEFAULT_DATABASE_PATH,
			);
			const cardSeparator = parsed.cardSeparator ?? JsonConfig.DEFAULT_CARD_SEPARATOR;
			return new JsonConfig(catalogPath, databasePath, cardSeparator);
		} catch {
			throw new Error(`Failed to read the configuration file ${path}: invalid JSON syntax.`);
		}
	}

	private static fileExists(path: string): boolean {
		return existsSync(path);
	}

	private static writeDefaultFile(path: string): void {
		const defaultConfig = {
			catalogPath: JsonConfig.DEFAULT_CATALOG_PATH,
			databasePath: JsonConfig.DEFAULT_DATABASE_PATH,
			cardSeparator: JsonConfig.DEFAULT_CARD_SEPARATOR,
		};
		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, JSON.stringify(defaultConfig, null, 4));
	}

	private static expanded(path: string): string {
		return path.startsWith("~/") ? path.replace("~", homedir()) : path;
	}
}
