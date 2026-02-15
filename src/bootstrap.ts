import type { Config } from "./app/Config.js";
import { ConsoleUserInterface } from "./app/cli/ConsoleUserInterface.js";
import { FileSystemCatalog } from "./app/persistence/FileSystemCatalog.js";
import { JsonConfig } from "./app/persistence/JsonConfig.js";
import { SQLiteScheduleTracker } from "./app/persistence/SQLiteScheduleTracker.js";
import { Reps } from "./app/Reps.js";
import type { UserInterface } from "./app/UserInterface.js";
import type { Catalog } from "./core/cataloging/Catalog.js";

export interface AppContext {
	readonly reps: Reps;
	readonly shutdown: () => void;
}

export function bootstrap(): AppContext {
	const config: Config = JsonConfig.load();
	// ju: Type this as a Closable ScheduleTracker.
	const scheduleTracker = new SQLiteScheduleTracker(config);
	const catalog: Catalog = new FileSystemCatalog(scheduleTracker, config);
	const userInterface: UserInterface = new ConsoleUserInterface();

	const reps = new Reps(catalog, userInterface);
	const shutdown = (): void => scheduleTracker.close();
	return { reps, shutdown };
}
