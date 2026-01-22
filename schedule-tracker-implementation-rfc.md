# RFC: SQLiteScheduleTracker Implementation

## Summary

Implement `SQLiteScheduleTracker`, a `ScheduleTracker` adapter that persists card scheduling data to a SQLite database using `better-sqlite3`.
The implementation will use the database path from `Config` and include a factory method `Schedule.fromPersisted()`
to reconstruct schedules from stored data.

## Motivation

The `ScheduleTracker` interface requires persistence of scheduling data
(consecutive successes, memory strength, review interval, last review date) so students can resume spaced repetition across CLI sessions.

## Schema

```sql
CREATE TABLE IF NOT EXISTS schedule (
    card_id TEXT PRIMARY KEY,
    consecutive_successes INTEGER NOT NULL,
    memory_strength REAL NOT NULL,
    review_interval_days INTEGER NOT NULL,
    reviewed_on DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Files to Modify/Create

| File                                      | Action                                |
|-------------------------------------------|---------------------------------------|
| `src/core/Schedule.ts`                    | Add `fromPersisted()` factory method  |
| `src/app/SQLiteScheduleTracker.ts`        | Implement `ScheduleTracker` interface |
| `tests/app/SQLiteScheduleTracker.test.ts` | Add unit tests                        |

## Implementation Details

### 1. Schedule.fromPersisted()

Add a static factory method to `src/core/Schedule.ts` for reconstructing schedules from persisted data. This method accepts:

- `consecutiveSuccesses: ConsecutiveSuccesses`
- `memoryStrength: MemoryStrength`
- `reviewInterval: ReviewInterval`
- `lastReview: DateReviewed`

The factory delegates to the private constructor, providing a clean public API for the infrastructure layer.
If there is no existing persisted data for the card, Schedule.forNewCard() should be used instead.

### 2. SQLiteScheduleTracker

The implementation in `src/app/SQLiteScheduleTracker.ts` must:

- Accept a `databasePath: string` in the constructor
- Initialize the schema on construction using `db.exec()`
- Implement `getFor(...cards: Card[]): Deck`
  - Query the database for each card by `card.id`
  - Return `ScheduledCard.fromUnreviewed(card)` for cards not found
  - Reconstruct `Schedule` using `Schedule.fromPersisted()` for cards found
  - Return a `Deck` containing all `ScheduledCard` instances
- Implement `saveFor(card: ScheduledCard): void`
  - Use `INSERT ... ON CONFLICT DO UPDATE` (upsert) pattern
  - Extract values from `card.schedule` properties
  - Update `updated_at` timestamp on conflict

#### Internal Structure

- `initializeSchema()`: Creates the table if it doesn't exist
- `loadOrCreate(card: Card)`: Queries and reconstructs or creates new
- `findByCardId(cardId: string)`: Prepared statement for lookup
- `reconstructSchedule(row)`: Maps database row to domain objects

### 3. Tests

Tests in `tests/app/SQLiteScheduleTracker.test.ts` must:

- Use the memfs mock pattern as specified:
  ```typescript
  vi.mock("node:fs", async () => {
      const memfs = await import("memfs");
      return memfs.fs;
  });
  ```
- Use `:memory:` SQLite database for fast, isolated tests
- Create a fresh tracker instance in `beforeEach`

#### Test Cases for `getFor`

- Returns deck with unreviewed schedule for unknown cards
- Returns deck with persisted schedule for known cards
- Handles multiple cards with mixed persisted and new schedules

#### Test Cases for `saveFor`

- Persists schedule data for new card
- Updates existing schedule on subsequent saves
- Preserves memory strength through round-trip
- Preserves review date through round-trip

#### Test Cases for Schema Initialization

- Creates schedule table on construction

## Edge Cases & Considerations

1. **Null `lastReview`**: The schema requires `reviewed_on NOT NULL` but `Schedule.forNewCard()` sets `lastReview` to `null`. The implementation must handle this—either by only saving cards that have been reviewed, or by relaxing the schema constraint to `DATETIME` (nullable).

2. **Directory Creation**: If the database path directory doesn't exist, `better-sqlite3` will fail. Consider creating parent directories before opening the database.

3. **Connection Management**: The current design opens the database in the constructor. Consider adding a `close()` method for resource cleanup.

## Open Questions

1. **Schema constraint**: Should `reviewed_on` be nullable to support saving unreviewed cards, or should `saveFor` only be called after a review (meaning `lastReview` is always set)?

2. **Directory creation**: Should `SQLiteScheduleTracker` create missing parent directories, or should that be the caller's responsibility?
