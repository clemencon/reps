import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export class Config {
	private static readonly PATH = "~/.config/reps.json";
	public static readonly DEFAULT_CATALOG_PATH = "~/reps";
	public static readonly DEFAULT_DATABASE_PATH = "~/.local/share/reps/schedule.sqlite";

	private constructor(
		public readonly catalogPath: string,
		public readonly databasePath: string,
	) {}

	public static load(): Config {
		if (!Config.fileExists()) Config.writeDefaultFile();
		return Config.parseFile(Config.PATH);
	}

	private static parseFile(path: string): Config {
		try {
			const fileContent = readFileSync(path, "utf-8");
			const parsed = JSON.parse(fileContent);
			return new Config(
				parsed.catalogPath ?? Config.DEFAULT_CATALOG_PATH,
				parsed.databasePath ?? Config.DEFAULT_DATABASE_PATH,
			);
		} catch {
			throw new Error(`Failed to read the configuration file ${path}: invalid JSON syntax.`);
		}
	}

	private static fileExists(): boolean {
		return existsSync(Config.PATH);
	}

	private static writeDefaultFile(): void {
		const defaultConfig = {
			catalogPath: Config.DEFAULT_CATALOG_PATH,
			databasePath: Config.DEFAULT_DATABASE_PATH,
		};
		mkdirSync(dirname(Config.PATH), { recursive: true });
		writeFileSync(Config.PATH, JSON.stringify(defaultConfig, null, 4));
	}
}
