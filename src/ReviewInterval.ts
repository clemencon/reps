export class ReviewInterval {
	public readonly days: number;

	private static readonly INITIAL_AMOUNT_OF_DAYS = 0;
	private static readonly MINIMUM_AMOUNT_OF_DAYS = 0;

	public constructor(days: number = ReviewInterval.INITIAL_AMOUNT_OF_DAYS) {
		if (!ReviewInterval.isValidAmount(days)) {
			throw new Error(`Invalid amount of days: ${days}. Must be a non-negative integer.`);
		}
		this.days = days;
	}

	private static isValidAmount(days: number): boolean {
		return Number.isInteger(days) && days >= ReviewInterval.MINIMUM_AMOUNT_OF_DAYS;
	}
}
