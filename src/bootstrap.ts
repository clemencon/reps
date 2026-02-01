import { CLI } from "./app/cli/CLI.js";
import { Config } from "./app/persistence/Config.js";
import { FileSystemCatalog } from "./app/persistence/FileSystemCatalog.js";
import { SQLiteScheduleTracker } from "./app/persistence/SQLiteScheduleTracker.js";
import { Reps } from "./app/Reps.js";
import type { UserInterface } from "./app/UserInterface.js";
import type { ScheduleTracker } from "./core/scheduling/ScheduleTracker.js";

export function bootstrap(): Reps {
	const config = Config.load();
	const scheduleTracker: ScheduleTracker = new SQLiteScheduleTracker(config.databasePath);
	const catalog = new FileSystemCatalog(config.catalogPath, scheduleTracker);
	const userInterface: UserInterface = new CLI();

	return new Reps(catalog, userInterface);
}
