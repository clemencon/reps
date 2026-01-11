import type { Grade } from "./Grade.js";

export class MemoryStrength {
	public readonly value: number;

	private static readonly INITIAL_VALUE = 2.5;
	private static readonly MINIMUM_VALUE = 1.3;

	public constructor(value: number = MemoryStrength.INITIAL_VALUE) {
		this.value = Math.max(MemoryStrength.MINIMUM_VALUE, value);
	}

	public recalculateAfterReview(grade: Grade): MemoryStrength {
		return new MemoryStrength(
			this.value + (0.1 - (5 - grade.value) * (0.08 + (5 - grade.value) * 0.02)),
		);
	}
}
