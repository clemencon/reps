# Contributing

## Development

```bash
pnpm build      # Full build pipeline with tests
pnpm fix        # Run biome formatter with auto-fix
pnpm check      # Run linting, type checking, tests, and coverage (full CI check)
pnpm test       # Run vitest in watch mode
pnpm graph      # Generate dependency graph (requires GraphViz)
```

## Architecture

```
src/
├── main.ts              # Entry point
├── bootstrap.ts         # DI wiring
├── app/                 # Application layer and infrastructure concerns
│   ├── Reps.ts          # Main application orchestrator
│   ├── UserInterface.ts
│   ├── cli/
│   └── persistence/
└── core/                # Domain layer
    ├── cataloging/
    └── scheduling/
```

![dependency-graph.svg](dependency-graph.svg)

## Design Decisions

- Cards and Topics: Plain text files in the filesystem (not in a database)
- Schedule: SQLite database tracking performance and review schedules
- Card Identification: SHA-1 hash of text file content

This hybrid approach keeps study material editable as plain text while maintaining performance data in a structured database.

## Testing

- 100% code coverage enforced (this was an experiment, I don't recommend it).
- Test structure mirrors source: `tests/core/cataloging/` maps to `src/core/cataloging/`
- Use Builder classes (`CardBuilder`, `DeckBuilder`, `TopicBuilder`, ...) for test setup, except for the SUT itself.

## Code Style

- Run `pnpm fix` before commits
- Explicit member accessibility (`public`, `private`, `readonly`)
- Explicit return types required
- All imports use `.js` file extensions (ESM requirement)
