// ju: Use this interface for all builders?
export interface Builder<BuildType> {
	build(): BuildType;
}
