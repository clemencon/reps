export class ConsecutiveSuccesses {
	public readonly count: number;

	private static readonly INITIAL_COUNT = 0;
	private static readonly MINIMUM_COUNT = 0;

	public constructor(count: number = ConsecutiveSuccesses.INITIAL_COUNT) {
		if (!ConsecutiveSuccesses.isValid(count)) {
			throw new Error(
				`Invalid count: ${count}. Must be at least ${ConsecutiveSuccesses.MINIMUM_COUNT}.`,
			);
		}
		this.count = count;
	}

	public increment(): ConsecutiveSuccesses {
		return new ConsecutiveSuccesses(this.count + 1);
	}

	private static isValid(count: number): boolean {
		return count >= ConsecutiveSuccesses.MINIMUM_COUNT;
	}
}
