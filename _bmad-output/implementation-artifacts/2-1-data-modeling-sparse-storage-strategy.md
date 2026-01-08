# Story 2.1: Data Modeling & Sparse Storage Strategy

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to define the Drizzle ORM schema for `events` and set up the sparse storage logic,
So that we have a type-safe structure for persisting memories without needing to store empty weeks.

## Acceptance Criteria

1.  **Schema Definition**: A Drizzle ORM schema is created for the `events` table.
2.  **Fields**: The table includes:
    *   `id`: UUID (Primary Key)
    *   `userId`: String (Indexed) - mapped to Clerk/Auth ID
    *   `weekIndex`: Integer (Indexed) - sparse representation of time
    *   `title`: String (Limit 50 chars)
    *   `description`: Text (Optional)
    *   `category`: Enum or String (e.g., 'work', 'family')
    *   `date`: Date/Timestamp
    *   `createdAt`: Timestamp
    *   `updatedAt`: Timestamp
3.  **Validation**: Zod schema (`insertEventSchema`, `selectEventSchema`) generated/defined for API validation.
4.  **Sparse Pattern**: Verification that NO `weeks` table is created. The grid relies on dynamic generation (Story 1.1) combined with this sparse event table.

## Tasks / Subtasks

- [ ] Install Drizzle Zod (AC: 3)
    - [ ] `npm install drizzle-zod`
- [ ] Create Schema File (AC: 1, 2)
    - [ ] Create `src/db/schema.ts` (or `src/lib/db/schema.ts` depending on pref, default `src/db`).
    - [ ] Define the `events` table using `pgTable`.
- [ ] Define Zod Schemas (AC: 3)
    - [ ] Export `insertEventSchema` using `createInsertSchema`.
- [ ] Database Connection Config (AC: 1)
    - [ ] Create `src/db/index.ts` to export the `db` client (even if connection string is missing, setup the structure).
    - [ ] *Note: Epic 3 deals with actual Neon connection, but we can set up the code structure now.*

## Dev Notes

- **Stack**: Drizzle ORM + Postgres (Neon).
- **Paths**: `src/db/*`.
- **Validation**: Use `drizzle-zod` to auto-generate zod schemas from the table definition to keep them in sync.

### Project Structure Notes

- New directory: `src/db`.

### References

- [Epics: Story 2.1](../planning-artifacts/epics.md)
- [Project Context](../../project-context.md)

## Dev Agent Record

### Agent Model Used

Gemini 3 Pro (Preview)

### Debug Log References

### Completion Notes List

### File List
