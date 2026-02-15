#!/usr/bin/env node

import { bootstrap } from "./bootstrap.js";

export async function main(): Promise<number> {
	const { reps, shutdown } = bootstrap();
	try {
		await reps.run();
		return 0;
	} catch (error: unknown) {
		// ju: Use custom exceptions and aggregate them.
		if (error instanceof Error && error.name === "ExitPromptError") {
			return 130;
		}
		console.error(error);
		return 1;
	} finally {
		shutdown();
	}
}

main().then((code) => process.exit(code));
