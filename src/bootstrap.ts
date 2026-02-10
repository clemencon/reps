import type { Config } from "./app/Config.js";
import { ConsoleUserInterface } from "./app/cli/ConsoleUserInterface.js";
import { FileSystemCatalog } from "./app/persistence/FileSystemCatalog.js";
import { JsonConfig } from "./app/persistence/JsonConfig.js";
import { SQLiteScheduleTracker } from "./app/persistence/SQLiteScheduleTracker.js";
import { Reps } from "./app/Reps.js";
import type { UserInterface } from "./app/UserInterface.js";
import type { Catalog } from "./core/cataloging/Catalog.js";
import type { ScheduleTracker } from "./core/scheduling/ScheduleTracker.js";

export function bootstrap(): Reps {
	const config: Config = JsonConfig.load();
	const scheduleTracker: ScheduleTracker = new SQLiteScheduleTracker(config.databasePath); // ju: Pass the config instead.
	const catalog: Catalog = new FileSystemCatalog(scheduleTracker, config);
	const userInterface: UserInterface = new ConsoleUserInterface();

	return new Reps(catalog, userInterface);
}
