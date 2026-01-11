import type { ReviewInterval } from "./ReviewInterval.js";

export class DateReviewed {
	private static readonly MS_PER_DAY = 1000 * 60 * 60 * 24;
	private readonly date: Date;

	constructor(date: Date) {
		const normalizedDate = DateReviewed.normalizeToMidnight(new Date(date));
		DateReviewed.validateDate(normalizedDate);
		this.date = normalizedDate;
	}

	public static today(): DateReviewed {
		return new DateReviewed(new Date());
	}

	public static fromIsoDateString(isoDateString: string): DateReviewed {
		return new DateReviewed(new Date(isoDateString));
	}

	public hasElapsed(interval: ReviewInterval): boolean {
		const diffTime = DateReviewed.today().date.getTime() - this.date.getTime();
		const diffDays = Math.floor(diffTime / DateReviewed.MS_PER_DAY);
		return diffDays >= interval.days;
	}

	public toIsoDateString(): string {
		const year = this.date.getFullYear();
		const month = String(this.date.getMonth() + 1).padStart(2, "0");
		const day = String(this.date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	private static normalizeToMidnight(date: Date): Date {
		const normalizedDate = new Date(date);
		normalizedDate.setHours(0, 0, 0, 0);
		return normalizedDate;
	}

	private static validateDate(date: Date): void {
		const today = DateReviewed.normalizeToMidnight(new Date());
		if (date > today) {
			throw new Error("Invalid review date: cannot be in the future.");
		}
	}
}
