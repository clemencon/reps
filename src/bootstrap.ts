import { Reps } from "./app/Reps.js";

export function bootstrap(): Reps {
	// Inject dependencies.
	return new Reps();
}
