# Story 2.2: The "Fill" UI (Write Interaction)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to fill out a form when I tap a week, containing Title, Category, and Description,
So that I can attach meaning to that specific time block.

## Acceptance Criteria

1. **Form Fields**: The `EventForm` component must allow editing of:
    - **Title**: Text input, required, max 50 characters.
    - **Category**: Select/Radio, required, visual badges for colors.
    - **Description**: Textarea, optional.
    - **Dates**: Start Date (pre-filled), End Date (optional).
2. **Validation**: Submitting the form with an empty title or title > 50 chars shows an inline error.
3. **Styling**: Component uses `shadcn/ui` components (Input, Textarea, Select/RadioGroup) and consistent typography.
4. **Integration**: The form integrates smoothly into the `WeekDetailDialog` (Drawer/Dialog) created in Story 1.4.

## Tasks / Subtasks

- [ ] Update Event Form Component (AC: 1, 3)
    - [ ] Refactor `src/components/events/event-form.tsx` to match the Drizzle schema.
    - [ ] Use `react-hook-form` and `zod` resolver (optional, or simple state if preferred for this scale).
    - [ ] Ensure `Category` selection handles the `CalendarCategory` visual cues (color dots).
- [ ] Implement Validation (AC: 2)
    - [ ] Enforce max-length 50 for Title.
    - [ ] Ensure Start Date is valid.
- [ ] Connect Types (AC: 1)
    - [ ] Ensure the form outputs a `LifeEvent` (or `NewEvent`) object compatible with the `EventContext`.

## Dev Notes

- **Existing Code**: `EventForm` exists but might be using mock types or simplified logic. Needs to be robust.
- **Validation**: Can reuse `insertEventSchema` from `src/db/schema.ts` with `zod`.

### Project Structure Notes

- Modify: `src/components/events/event-form.tsx`.

### References

- [Epics: Story 2.2](../planning-artifacts/epics.md)
- [Project Context](../../project-context.md)

## Dev Agent Record

### Agent Model Used

Gemini 3 Pro (Preview)

### Debug Log References

### Completion Notes List

### File List
