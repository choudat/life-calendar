---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: [
  "_bmad-output/planning-artifacts/prd.md",
  "_bmad-output/planning-artifacts/architecture.md",
  "_bmad-output/planning-artifacts/ux-design-specification.md"
]
---

# Life Calendar - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Life Calendar, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can authenticate using Third-Party Providers (Google).
FR2: Users can authenticate using Email (Magic Link or Passwordless flow).
FR3: Users remain authenticated across page reloads and browser sessions until logout.
FR4: Users can explicitly log out, clearing their local session.
FR5: Unauthenticated Visitors can input birthday and life expectancy to preview their generated life grid.
FR6: Unauthenticated Visitors can define one "Key Past Event" during the preview flow.
FR7: The System must preserve the Unauthenticated Visitor's preview data during the Sign-Up process (Deferred Auth).
FR8: Users are redirected to their personalized dashboard immediately after successful account creation.
FR9: Users can view their life grid visualized in weeks, with past weeks distinct from future weeks.
FR10: Users can create a new Life Event with a Title, Date, and Description.
FR11: Users can edit existing Life Events.
FR12: Users can delete Life Events.
FR13: Users can assign a Category (e.g., Work, Family, Travel) to an event.
FR14: Users can view a summary of their "Years Passed" vs "Years Remaining".
FR15: The System automatically saves all created/edited events to the cloud database.
FR16: The System synchronizes user data across multiple devices logged into the same account.
FR17: Users see a visual indicator when their data is successfully saved (or if sync fails).
FR18: Users can export all their event data in a machine-readable format (JSON/CSV).
FR19: Users can permanently delete their account and all associated data ("Hard Delete").
FR20: Users can update their `Date of Birth` and `Life Expectancy` settings post-onboarding (triggering a grid recalculation).
FR21: Users can update their account details (Display Name).
FR22: The System must support "Optimistic UI" updates (events appear immediately before server confirmation).
FR23: The System maintains a local "Offline Queue" for actions performed without network connectivity.
FR24: The System must prevent data loss during session expiry (Re-auth modal without page refresh).
FR26: Users can filter the Life Grid visualization by Category (e.g., show only "Work").
FR27: The System validates Event Dates against the user's lifespan boundaries.

### NonFunctional Requirements

NFR1: Core Web Vitals LCP < 2.5s on mobile/desktop.
NFR2: Core Web Vitals INP < 200ms.
NFR3: Core Web Vitals CLS < 0.1.
NFR4: Core Web Vitals TTFB < 600ms (Must exclude static assets from Clerk Middleware matcher).
NFR5: Database must use **Neon Connection Pooling** endpoint (Transaction Mode).
NFR6: Database Driver `@neondatabase/serverless` (for Edge/WebSocket).
NFR7: First Load JS bundle < 120kb (Gzipped).
NFR8: Dashboard Loading State must render under 1.5s on 4G.
NFR9: Auth Clerk Integration with **Svix Signature Verification**.
NFR10: Tenant isolation (Service Layer) or RLS.
NFR11: Strict Content Security Policy (Nonce-based).
NFR12: Optimistic UI required for all Standard CRUD mutations.
NFR13: Synchronous Server Actions must limit execution to < 10s (Vercel Hobby Limit).
NFR14: Async Processing for >10s operations.
NFR15: Cold Starts handled by Skeleton UI / Streaming Suspense.

### Additional Requirements

**Architecture Requirements:**
- **Starter Template**: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- **Stack**: Next.js 15, Drizzle ORM, Neon Serverless Postgres, TanStack Query, TanStack Virtual, Tailwind v4, Clerk.
- **Project Structure**: Strict `src/app/(tool)` vs `src/app/(auth)` route grouping.
- **Pattern**: Server Actions with "Hybrid" error handling (Return Object for logic, Throw for system).
- **Pattern**: Co-located tests (`WeekCell.test.tsx`).
- **Logic**: Centralized `date-logic.ts` for Week Math using `date-fns`.

**UX Design Requirements:**
- **Mobile Grid**: `grid-cols-[13]` (Mobile) -> `grid-cols-[26]` (Tablet) -> `grid-cols-[52]` (Desktop).
- **Virtualization**: TanStack Virtual or similar windowing to support 4,680 nodes.
- **Interaction**: No date pickers by default; tapping a cell implies date.
- **Components**: Bottom Sheet (`Vaul` wrapper around Radix Dialog) for editing events on mobile.
- **Aesthetic**: "Biographer" / "Archive Stone" theme. `Lora` (Serif) + `Geist Sans` fonts.
- **States**: Past (Filled/High Opacity) vs Future (Outline/Low Opacity). Filled weeks are "Memories".
- **Visuals**: `gap-1` rounded cells ("Pebbles").
- **Accessibility**: Color Blindness Mode (Shapes/Icons), Semantic `<ol>` list for Grid with `aria-label`s.

### FR Coverage Map

FR1 (Google Auth): Epic 3
FR2 (Email Auth): Epic 3
FR3 (Session): Epic 3
FR4 (Logout): Epic 3
FR5 (Anon Input): Epic 1
FR6 (Key Event): Epic 1
FR7 (Deferred Auth): Epic 3
FR8 (Redirect): Epic 3
FR9 (Grid Viz): Epic 1
FR10 (Create Event): Epic 2
FR11 (Edit Event): Epic 2
FR12 (Delete Event): Epic 2
FR13 (Categorize): Epic 2
FR14 (Summary Stats): Epic 1
FR15 (Cloud Save): Epic 3
FR16 (Device Sync): Epic 3
FR17 (Sync Indicator): Epic 3
FR18 (Export): Epic 4
FR19 (Hard Delete): Epic 4
FR20 (Update DOB): Epic 1
FR21 (Update Profile): Epic 4
FR22 (Optimistic UI): Epic 2
FR23 (Offline Queue): Epic 3
FR24 (Session Re-auth): Epic 3
FR26 (Filter Category): Epic 1
FR27 (Date Validation): Epic 1

## Epic List

### Epic 1: The Biographer's Grid
**Goal:** Deliver the core "Shock" value proposition by rendering an interactive life grid for unauthenticated visitors.
**FRs Covered:** FR5, FR6, FR9, FR14, FR20, FR26, FR27.

### Story 1.1: Project Initialization & Barebones Grid

As a Developer,
I want to initialize the Next.js project with the defined stack (Tailwind v4, TanStack Virtual) and render a performant 4,000-node grid,
So that we have a stable technical foundation that meets the 60fps mobile requirement.

**Acceptance Criteria:**

**Given** a fresh environment
**When** I run the `create-next-app` command and install dependencies (drizzle, tanstack virtual, lucide, shadcn)
**Then** the project should build without errors
**And** I should see a grid of 4,680 simple `div` elements rendered using `TanStack Virtual`
**And** scrolling on a mobile viewport should be smooth (60fps target)

### Story 1.2: Weeks Lived Logic & Onboarding Input

As a Visitor,
I want to enter my Date of Birth onto a simple landing screen,
So that the system can calculate how many weeks I have lived versus how many are left.

**Acceptance Criteria:**

**Given** I am on the home page as a new user
**When** I enter "1990-01-01" into the Date of Birth input
**Then** the system should calculate the standard life expectancy (90 years)
**And** store `birthDate` in a local React state (Context or Zustand)
**And** output the total weeks lived (e.g., ~1,700) and weeks remaining

### Story 1.3: Visualizing the Past vs Future

As a Visitor,
I want to see my lived weeks visually distinguished from my future weeks,
So that I feel the emotional impact of "Time Scarcity" (The Biographer aesthetic).

**Acceptance Criteria:**

**Given** I have entered a valid specific DOB
**When** the Grid renders
**Then** all "Past" weeks should be filled with `bg-stone-900` (or similar dark token)
**And** all "Future" weeks should be outlined or low opacity `bg-stone-200`
**And** "Current Week" should have a distinct pulse animation
**And** The grid responds to mobile breakpoints (13 cols) vs desktop (52 cols)

### Story 1.4: Grid Interactivity (Tap to View)

As a Visitor,
I want to tap any cell to see its specific date range and "Age at that time",
So that I can orient myself in my own history.

**Acceptance Criteria:**

**Given** the grid is populated
**When** I click/tap on Week #1000
**Then** A Bottom Sheet (Drawer) should open
**And** display "Age: 19. Week of Oct 12, 2009"
**And** The URL should NOT change (keep it simple for now)
**And** I should be able to close the sheet by swiping down

### Epic 2: The Memory Keeper
**Goal:** Enable the core "Habit" loop of logging, editing, and categorizing memories on the grid with optimistic UI.
**FRs Covered:** FR10, FR11, FR12, FR13, FR22.

### Story 2.1: Data Modeling & Sparse Storage Strategy

As a Developer,
I want to define the Drizzle ORM schema for `events` and set up the sparse storage logic,
So that we have a type-safe structure for persisting memories without needing to store empty weeks.

**Acceptance Criteria:**

**Given** the Drizzle setup from Epic 1
**When** I create `src/db/schema.ts`
**Then** I should define an `events` table with fields: `id`, `userId` (indexed), `weekIndex` (indexed), `title` (max 50), `description`, `category`, `date`
**And** I should define Zod schemas (`insertEventSchema`) for validation
**And** I should verify that we do NOT create a `weeks` table (Sparse pattern)

### Story 2.2: The "Fill" UI (Write Interaction)

As a User,
I want to fill out a form when I tap a week, containing Title, Category, and Description,
So that I can attach meaning to that specific time block.

**Acceptance Criteria:**

**Given** the Bottom Sheet is open for a week
**When** I view the "Add Memory" form
**Then** I should see a Title input (required), Category Select (with colored badges), and Description textarea
**And** Tapping "Save" should validate the Title length
**And** The UI should use `shadcn/ui` components styled with the "Biographer" serif font

### Story 2.3: Optimistic State Management

As a User,
I want the grid to update *instantly* when I click save,
So that the interface feels physical and responsive (Optimistic UI).

**Acceptance Criteria:**

**Given** I am on the "Add Memory" form
**When** I click "Save"
**Then** The Bottom Sheet should close immediately
**And** The targeted Grid Cell should turn the color of the selected Category instantly (before server confirmation)
**And** If the backend fails (simulated), the cell should revert to its previous state and show a Toast error

### Story 2.4: Editing & Deleting Memories

As a User,
I want to edit typos or delete memories I no longer want,
So that I maintain control over my life's narrative.

**Acceptance Criteria:**

**Given** I tap a cell that already has a memory
**When** The sheet opens
**Then** The form should be pre-filled with existing data
**And** A crimson "Delete" button should be visible
**And** Clicking Delete should show a confirmation dialog (Prevent accidental wipes)
**And** Confirming delete should instantly revert the cell to the default "Past" color/state

### Epic 3: Identity & Permanence
**Goal:** Convert visitors to users via Authentication and secure their local data to the cloud (Deferred Auth).
**FRs Covered:** FR1, FR2, FR3, FR4, FR7, FR8, FR15, FR16, FR17, FR23, FR24.

### Story 3.1: Clerk Authentication Integration

As a Developer,
I want to integrate Clerk Authentication and configured middleware,
So that we can manage user identities securely across sessions.

**Acceptance Criteria:**

**Given** the Next.js app
**When** I configure Clerk Provider and Middleware
**Then** I should be able to protect the `/app` route (redirect to login)
**And** I should have a designated `/sign-in` page matching the app's theme
**And** I should support Google and Email OTP login methods

### Story 3.2: Neon/Drizzle Database Connection

As a Developer,
I want to connect the application to the Neon Serverless Postgres database,
So that data is persisted permanently and scalable.

**Acceptance Criteria:**

**Given** a Neon project string
**When** I configure the Drizzle Client with `@neondatabase/serverless`
**Then** I should be able to run `drizzle-kit push` to create the schema (defined in Epic 2)
**And** I should verify the connection is using the "Pooling" endpoint (transaction mode) for scalability

### Story 3.3: Authorized Server Actions

As a Developer,
I want to secure my Server Actions so that only the authenticated owner can modify their data,
So that we prevent unauthorized access or data tampering.

**Acceptance Criteria:**

**Given** the `createEventAction` and `updateEventAction`
**When** a request comes in
**Then** the action must first check `auth().userId` from Clerk
**And** if null, throw an "Unauthorized" error
**And** updates must include a `where(eq(events.userId, userId))` clause to ensure ownership

### Story 3.4: The "Deferred Auth" Sync

As a User,
I want the memories I created BEFORE signing up to automatically transfer to my new account,
So that I don't lose the work I did during the "Try it out" phase.

**Acceptance Criteria:**

**Given** I have created an event in "Guest Mode" (stored in LocalStorage)
**When** I successfully Sign Up and reach the dashboard
**Then** a background process should detect the local events
**And** call a bulk upload Server Action to save them to Neon
**And** clear the LocalStorage "Guest" data upon success
**And** show a toast "Your preview data has been secured"

### Story 3.5: Offline Queue & Sync Indicator

As a User,
I want to know if my data is saved, and be able to keep working if I lose signal (Subway Mode),
So that I trust the app's reliability.

**Acceptance Criteria:**

**Given** I am editing the grid
**When** I lose internet connection
**Then** TanStack Query `persistClient` should cache my mutations
**And** A "Cloud Offline" icon should appear in the header
**When** connection returns
**Then** The queued mutations should execute automatically
**And** The icon should change to a green "Cloud Checked" state

### Epic 4: Sovereignty & Polish
**Goal:** Ensure production trust through data sovereignty (Export/Delete) and performance audit compliance.
**FRs Covered:** FR18, FR19, FR21, NFR1-15.

### Story 4.1: Data Export (JSON/CSV)

As a User,
I want to download a copy of all my logged memories,
So that I feel safe knowing I am not locked into the platform (Data Sovereignty).

**Acceptance Criteria:**

**Given** I am in the Settings menu
**When** I click "Export Data"
**Then** the system should generate a JSON or CSV file containing all my events
**And** the file should download automatically to my device
**And** the export should handle special characters in descriptions correctly

### Story 4.2: The "Hard Delete" Account Nuke

As a User,
I want to permanently delete my account and all associated data,
So that I can exercise my "Right to be Forgotten".

**Acceptance Criteria:**

**Given** I am in the Danger Zone of Settings
**When** I click "Delete Account"
**Then** I must be prompted to type a confirmation phrase (e.g., "DELETE")
**And** upon confirmation, a Server Action must delete all rows in `events` where `userId` matches
**And** trigger the Clerk deletion API
**And** redirect me to the homepage with a "Good bye" message

### Story 4.3: User Profile Management

As a User,
I want to update my Display Name or adjust my Life Expectancy,
So that the grid accurate reflects my current perspective.

**Acceptance Criteria:**

**Given** I am in the Profile settings
**When** I change my Life Expectancy from 90 to 100
**Then** the Grid should immediately re-render with the new row count (5,200 weeks)
**And** the "Years Left" summary statistic should update instantly

### Story 4.4: Performance & Lighthouse Audit

As a Developer,
I want to audit the application against Core Web Vitals,
So that we ensure the "Biographer" grid does not crash low-end mobile browsers.

**Acceptance Criteria:**

**Given** the production build
**When** I run a Lighthouse audit on the Dashboard
**Then** the LCP (Largest Contentful Paint) should be < 2.5s
**And** Formatting Context Layout Shift (CLS) should be < 0.1 (Stable Grid)
**And** Accessibility score should be > 90 (WCAG AA colors)

