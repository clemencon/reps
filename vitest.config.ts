import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		exclude: ["tests/e2e/**", "node_modules/**"],
		coverage: {
			exclude: ["tests/e2e/**"],
			thresholds: {
				lines: 100,
				functions: 100,
				branches: 100,
				statements: 100,
			},
		},
	},
});
