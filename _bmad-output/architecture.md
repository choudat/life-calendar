# Architecture Documentation

## Executive Summary
Life Calendar is a monolithic web application built with Next.js 16 (App Router). It provides a responsive interface for visualizing life events on a temporal grid. The application is client-focused with local state management, designed to transition to a full-stack architecture with backend persistence in future phases.

## Technology Stack

| Category | Technology | Version | Justification |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 16.1.1 | React App Router for modern routing and SSR capabilities. |
| **Language** | TypeScript | 5.x | Type safety and better developer experience. |
| **UI Library** | React | 19.x | Component-based UI architecture. |
| **Styling** | Tailwind CSS | v4 | Utility-first styling for rapid development. |
| **Icons** | Lucide React | Latest | Consistent and lightweight icon set. |
| **Date Logic** | date-fns | 4.x | Robust date manipulation library. |
| **State** | React Context | N/A | Global state management for event data. |

## Architecture Pattern
**Layered Component Architecture (Monolith)**

The application follows a standard Next.js App Router structure:
1.  **Routing Layer (`src/app`)**: Handles navigation, layouts, and page rendering.
2.  **Context Layer (`src/context`)**: manages global application state (Events, Calendars).
3.  **Component Layer (`src/components`)**:
    - **UI**: Atomic, reusable components (Button, Input).
    - **Domain**: Feature-specific components (CalendarGrid, EventForm).
4.  **Logic Layer (`src/lib`)**: Pure functions for business logic (grid calculations) and utilities.

## Data Models
(See [Data Models Documentation](./data-models.md))
- Core entities: `Calendar`, `Event`, `Period` defined in `src/types/calendar.ts`.

## UI Component Architecture
(See [Component Inventory](./component-inventory.md))
- **Atomic Design**: Basic UI elements in `src/components/ui`.
- **Composition**: Complex features composed in `src/components/calendar` and `src/components/events`.

## Integration Points
- Currently operates as a standalone frontend application.
- Future integrations planned: Auth (Clerk), Database (Prisma/PostgreSQL).

## Development Workflow
(See [Development Guide](./development-guide.md))
- Standard Next.js workflow (`npm run dev`).
- Linting via ESLint.
- Code formatting and style enforcement via TypeScript/Tailwind rules.
