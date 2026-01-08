# Story 1.2: Weeks Lived Logic & Onboarding Input

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Visitor,
I want to enter my Date of Birth onto a simple landing screen,
So that the system can calculate how many weeks I have lived versus how many are left.

## Acceptance Criteria

1. **Input Interface**: A clear, accessible input field for "Date of Birth" is available on the landing page (or a dedicated welcome modal).
2. **State Management**: The user's birth date is stored in a global client-side state (React Context or Zustand) to persist across component re-renders.
    - Default state might be `null` or a placeholder, but upon entry, it updates.
3. **Calculation Logic**:
    - System calculates "Weeks Lived" based on Current Date - DOB.
    - System calculates "Weeks Remaining" based on (DOB + Life Expectancy) - Current Date.
    - Default life expectancy is 90 years.
4. **Visual Feedback**:
    - The UI displays the calculated counts (e.g., "You have lived 1,200 weeks").
    - The Grid component (from Story 1.1) updates to reflect this new `birthDate`.

## Tasks / Subtasks

- [ ] State Management Setup (AC: 2)
    - [ ] Check/Update `src/context/EventsContext.tsx` (or create `UserContext`) to hold `birthDate` and `lifeExpectancy`.
    - [ ] Ensure the context provides a `setBirthDate` method.
- [ ] Onboarding Component (AC: 1)
    - [ ] Create `components/onboarding/birth-date-input.tsx`.
    - [ ] Use `shadcn/ui` Input or a date picker component.
    - [ ] Validate input (must be in the past).
- [ ] UI Integration (AC: 4)
    - [ ] Integrate the input into `app/page.tsx` (or a welcome dialog).
    - [ ] Display summary stats ("X weeks lived") near the grid or in the header.
- [ ] Grid Connection (AC: 4)
    - [ ] Connect the `CalendarGrid` to the Context's `birthDate` instead of the hardcoded mock date.

## Dev Notes

- **Architecture**:
    - Prefer React Context for this simple global state.
    - `EventsContext` might be too specific; consider renaming to `AppContext` or adding `userSettings` slice to it if it already exists.
- **Components**:
    - Keep the input simple. `date-fns` for parsing.
- **UX**:
    - If the user hasn't entered a date, show a default (e.g., today or a sample date) OR show a prompt "Enter your birthday to begin".
    - For this story, we can default to the "Mock Date" until the user changes it, or start blank. The generic "Shock" value proposition usually requires a default to be visible immediately, so maybe keep the Mock Date as initial state but allow override.

### Project Structure Notes

- `src/components/onboarding/` does not exist yet; create it.

### References

- [Epics: Story 1.2](../planning-artifacts/epics.md)
- [Project Context](../../project-context.md)

## Dev Agent Record

### Agent Model Used

Gemini 3 Pro (Preview)

### Debug Log References

### Completion Notes List

### File List
