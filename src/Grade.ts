export class Grade {
	public readonly value: number;

	private static readonly MINIMUM_VALUE = 0;
	private static readonly MAXIMUM_VALUE = 5;
	private static readonly CORRECT_THRESHOLD = 3;

	public constructor(value: number) {
		if (!Grade.isValid(value)) {
			throw new Error(
				`Invalid grade: ${value}. Must be an integer between ${Grade.MINIMUM_VALUE} and ${Grade.MAXIMUM_VALUE}.`,
			);
		}
		this.value = value;
	}

	get isCorrectResponse(): boolean {
		return this.value >= Grade.CORRECT_THRESHOLD;
	}

	private static isValid(value: number) {
		return Number.isInteger(value) && value >= Grade.MINIMUM_VALUE && value <= Grade.MAXIMUM_VALUE;
	}
}
