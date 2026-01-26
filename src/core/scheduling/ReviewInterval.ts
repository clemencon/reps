export class ReviewInterval {
	public readonly days: number;

	private static readonly INITIAL_AMOUNT_OF_DAYS = 0;
	private static readonly MINIMUM_AMOUNT_OF_DAYS = 0;

	public constructor(days: number = ReviewInterval.INITIAL_AMOUNT_OF_DAYS) {
		ReviewInterval.validateDays(days);
		this.days = days;
	}

	private static validateDays(days: number): void {
		if (!Number.isInteger(days) || days < ReviewInterval.MINIMUM_AMOUNT_OF_DAYS) {
			throw new Error(`Invalid amount of days: ${days}. Must be a non-negative integer.`);
		}
	}
}
