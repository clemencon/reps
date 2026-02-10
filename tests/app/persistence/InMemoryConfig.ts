import type { Config } from "../../../src/app/Config.js";

export class InMemoryConfig implements Config {
	public constructor(
		public readonly cardSeparator: string = "???",
		public readonly catalogPath: string = "",
		public readonly databasePath: string = "",
	) {}
}
