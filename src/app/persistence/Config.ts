import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname } from "node:path";

export class Config {
	private static readonly DEFAULT_CONFIG_PATH = "~/.config/reps.json";
	public static readonly DEFAULT_CATALOG_PATH = "~/reps";
	public static readonly DEFAULT_DATABASE_PATH = "~/.local/share/reps/schedule.sqlite";

	private constructor(
		public readonly catalogPath: string,
		public readonly databasePath: string,
	) {}

	public static load(): Config {
		const path = Config.pathToFile();
		if (!Config.fileExists(path)) Config.writeDefaultFile(path);
		return Config.parseFile(path);
	}

	private static pathToFile(): string {
		const path = process.env["REPS_CONFIG_PATH"] ?? Config.DEFAULT_CONFIG_PATH;
		return Config.expanded(path);
	}

	private static parseFile(path: string): Config {
		try {
			const fileContent = readFileSync(path, "utf-8");
			const parsed = JSON.parse(fileContent);
			const catalogPath = Config.expanded(parsed.catalogPath ?? Config.DEFAULT_CATALOG_PATH);
			const databasePath = Config.expanded(parsed.databasePath ?? Config.DEFAULT_DATABASE_PATH);
			return new Config(catalogPath, databasePath);
		} catch {
			throw new Error(`Failed to read the configuration file ${path}: invalid JSON syntax.`);
		}
	}

	private static fileExists(path: string): boolean {
		return existsSync(path);
	}

	private static writeDefaultFile(path: string): void {
		const defaultConfig = {
			catalogPath: Config.DEFAULT_CATALOG_PATH,
			databasePath: Config.DEFAULT_DATABASE_PATH,
		};
		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, JSON.stringify(defaultConfig, null, 4));
	}

	private static expanded(path: string): string {
		return path.startsWith("~/") ? path.replace("~", homedir()) : path;
	}
}
