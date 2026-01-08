# Story 1.4: Grid Interactivity (Tap to View)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Visitor,
I want to tap any cell to see its specific date range and "Age at that time",
So that I can orient myself in my own history.

## Acceptance Criteria

1. **Interaction**: Tapping any week cell opens a detail view.
2. **Detail Component**: Use a Bottom Sheet (Drawer) on Mobile and a Dialog/Modal on Desktop.
    - Leveraging `vaul` (via `shadcn/drawer`) is preferred for mobile.
3. **Content Display**: The detail view shows:
    - "Week of [Start Date] - [End Date]"
    - "Age: [X] years old"
    - List of events (if any) in that week.
4. **Navigation**:
    - The URL does **not** need to change for this story (keep state local).
    - User can close the view by tapping backdrop or swiping down (mobile).
5. **Add Event Trigger**: The detail view should have an "Add Event" button (functionality to be implemented in Epic 2, but button should exist).

## Tasks / Subtasks

- [ ] Install Drawer Component (AC: 2)
    - [ ] Install `vaul` or use Shadcn `Drawer` component.
- [ ] Create Detail Component (AC: 2, 3)
    - [ ] Create `src/components/calendar/week-detail-drawer.tsx`.
    - [ ] formatting dates using `date-fns` (French locale).
- [ ] Connect Grid Click Handler (AC: 1)
    - [ ] Update `calendar-grid-virtualized.tsx` to call `onCellClick`.
    - [ ] In `page.tsx`, wire `onCellClick` to open the drawer with the selected cell data.
- [ ] Responsive Behavior (AC: 2)
    - [ ] Ensure it acts as a Drawer on mobile and Dialog on desktop (using `useMediaQuery` or Shadcn's responsive dialog pattern).

## Dev Notes

- **Components**:
    - Shadcn: `Drawer`, `Dialog`, `Button`.
- **State**:
    - `page.tsx` already has `selectedCell` state. Ensure it drives the Drawer visibility.
- **Future Proofing**:
    - The "Add Event" button is a placeholder for now, or can open the form (Story 2.2). For 1.4, seeing the button is enough.

### Project Structure Notes

- New component: `src/components/calendar/week-detail-drawer.tsx`.

### References

- [Epics: Story 1.4](../planning-artifacts/epics.md)
- [Project Context](../../project-context.md)

## Dev Agent Record

### Agent Model Used

Gemini 3 Pro (Preview)

### Debug Log References

### Completion Notes List

### File List
