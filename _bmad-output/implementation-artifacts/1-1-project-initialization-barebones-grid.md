# Story 1.1: Project Initialization & Barebones Grid

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to initialize the Next.js project with the defined stack (Tailwind v4, TanStack Virtual) and render a performant 4,000-node grid,
So that we have a stable technical foundation that meets the 60fps mobile requirement.

## Acceptance Criteria

1. **Initialization**: The project is initialized with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4.
2. **Dependencies**: Critical dependencies are installed: `drizzle-orm`, `@neondatabase/serverless`, `@tanstack/react-virtual`, `lucide-react`, `clsx`, `tailwind-merge`, `date-fns`.
3. **Build Stability**: The project builds (`npm run build`) without errors.
4. **Grid Rendering**: A grid of ~4,680 nodes (representing 90 years of weeks) is rendered using `TanStack Virtual`.
    - Nodes are simple `div` elements for this story.
5. **Responsiveness**:
    - Mobile: Display 13 columns.
    - Tablet: Display 26 columns.
    - Desktop: Display 52 columns.
6. **Performance**: Scrolling the grid on a mobile viewport is smooth (targeting 60fps).

## Tasks / Subtasks

- [ ] Initialize Project & Cleanup (AC: 1, 3)
    - [ ] Verify `next.config.ts`, `tsconfig.json`, `package.json` align with Next.js 15 standards.
    - [ ] Clean up default boilerplate (page.tsx, globals.css).
    - [ ] Setup `src` directory structure (`app`, `components`, `lib`, `types`).
- [ ] Install & Configure Core Dependencies (AC: 2)
    - [ ] Install `clsx`, `tailwind-merge`, `lucide-react`, `date-fns`.
    - [ ] Install `@tanstack/react-virtual` for virtualization.
    - [ ] Install Drizzle/Neon packages (setup can be basic for now, just install).
- [ ] Implement Main Layout & Grid Logic (AC: 4, 5)
    - [ ] Create `lib/calendar-logic.ts` to generate the array of weeks (4,680 items).
    - [ ] Create `components/calendar/calendar-grid-virtualized.tsx` using `@tanstack/react-virtual`.
    - [ ] Configure `Tailwind` for grid columns (`grid-cols-13`, `md:grid-cols-26`, `lg:grid-cols-52`).
- [ ] Create Dashboard Page (AC: 4)
    - [ ] Update `app/page.tsx` (or `app/app/page.tsx` if using route groups) to render the grid.
- [ ] Verify Performance & Build (AC: 3, 6)
    - [ ] Run build.
    - [ ] Manual check of scrolling performance.

## Dev Notes

- **Architecture**:
    - Use `src/app` router.
    - Use `TanStack Virtual`'s `useWindowVirtualizer` or `useVirtualizer` depending on whether using window scrolling or a scroll container. **Window scrolling is preferred for mobile feel.**
    - Strictly follow Tailwind v4 usage (no `tailwind.config.ts` needed for basic theme, use CSS variables in `globals.css` if custom tokens needed).
- **Source Tree**:
    - `src/lib/calendar-logic.ts`: Central place for "Weeks generation".
    - `src/components/calendar/`: New folder for grid components.
- **Testing**:
    - Ensure logical calculations in `calendar-logic.ts` are correct (total weeks = 52 * 90 roughly).

### Project Structure Notes

- Follow the `src` directory pattern.
- Ensure `globals.css` properly imports Tailwind v4.

### References

- [Epics: Story 1.1](../planning-artifacts/epics.md)
- [Project Context](../../project-context.md)

## Dev Agent Record

### Agent Model Used

Gemini 3 Pro (Preview)

### Debug Log References

### Completion Notes List

### File List
