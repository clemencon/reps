export class DateReviewed {
	private static readonly MS_PER_DAY = 24 * 60 * 60 * 1000;
	private readonly reviewedOn: Date;

	public constructor(date: Date) {
		DateReviewed.validateDate(date);
		this.reviewedOn = date;
	}

	public static today(): DateReviewed {
		return new DateReviewed(new Date());
	}

	public static fromIsoDateString(isoDateString: string): DateReviewed {
		return new DateReviewed(new Date(isoDateString));
	}

	public get daysSinceReview(): number {
		const now = new Date();
		const elapsedTimeMs = now.getTime() - this.reviewedOn.getTime();
		return Math.floor(elapsedTimeMs / DateReviewed.MS_PER_DAY);
	}

	public toIsoString(): string {
		return this.reviewedOn.toISOString();
	}

	private static validateDate(date: Date): void {
		if (date > new Date()) {
			throw new Error("Invalid review date: cannot be in the future.");
		}
	}
}
