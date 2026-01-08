# Story 1.3: Visualizing the Past vs Future

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Visitor,
I want to see my lived weeks visually distinguished from my future weeks,
So that I feel the emotional impact of "Time Scarcity" (The Biographer aesthetic).

## Acceptance Criteria

1. **Visual Distinction**:
    - **Past Weeks**: Filled with a dark, solid color (e.g., `bg-stone-900`) to represent time "set in stone".
    - **Future Weeks**: Outlined or light color (e.g., `bg-stone-200`) to represent "unwritten potential".
2. **Current Week**: The specific cell corresponding to the current week has a distinct "pulse" animation `ring-2 ring-indigo-500`.
3. **Responsiveness**: The grid maintains these visuals correctly across all screen sizes (Mobile 13 cols, Desktop 52 cols).
4. **Performance**: The conditional styling does not degrade scroll performance (must stay 60fps).

## Tasks / Subtasks

- [ ] Verify Grid Styling Logic (AC: 1, 3)
    - [ ] Check `src/components/calendar/calendar-grid-virtualized.tsx` to ensure `isPast` logic is visually distinctive via Tailwind classes.
    - [ ] Ensure "Future" weeks are visually distinct (e.g. `bg-stone-200` or transparent with border).
- [ ] Implement Pulse Animation (AC: 2)
    - [ ] Ensure the "Current Week" cell has `animate-pulse` or a custom CSS keyframe animation for a subtle "heartbeat" effect.
- [ ] Manual Visual Check (AC: 4)
    - [ ] Run the app and verify the aesthetic on both mobile and desktop viewports.

## Dev Notes

- **Implementation Status**: Much of this was likely scaffolded in Story 1.1. This story acts as a "Polish & Validate" step for the visual language.
- **Design Tokens**: Use `stone` colors for the "Archive/Biographer" feel. `stone-900` for past, `stone-200` for future.
- **Optimization**: Ensure the `isPast` check in `calendar-logic` is efficient.

### Project Structure Notes

- No new files expected, just updates to `calendar-grid-virtualized.tsx`.

### References

- [Epics: Story 1.3](../planning-artifacts/epics.md)
- [Project Context](../../project-context.md)

## Dev Agent Record

### Agent Model Used

Gemini 3 Pro (Preview)

### Debug Log References

### Completion Notes List

### File List
