import type { ReviewInterval } from "./ReviewInterval.js";

export class DateReviewed {
	private readonly reviewedOn: Date;

	constructor(date: Date) {
		DateReviewed.validateDate(date);
		this.reviewedOn = date;
	}

	public static today(): DateReviewed {
		return new DateReviewed(new Date());
	}

	public static fromIsoDateString(isoDateString: string): DateReviewed {
		return new DateReviewed(new Date(isoDateString));
	}

	public hasElapsed(interval: ReviewInterval): boolean {
		const nextReviewTime = new Date(this.reviewedOn);
		nextReviewTime.setDate(nextReviewTime.getDate() + interval.days);
		return new Date() >= nextReviewTime;
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
