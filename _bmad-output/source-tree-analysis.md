# Source Tree Analysis

## Critical Folders

### `src/app`
Container for the App Router structure.
- **Entry Points:** `layout.tsx`, `page.tsx`.
- **Key Routes:** `/` (Dashboard), `/mentions-legales`.

### `src/components`
Contains all React components.
- **`ui/`**: Reusable atomic components (Button, Input, etc.).
- **`calendar/`**: Domain specific components for the calendar grid visualization.
- **`events/`**: Components related to event management (lists, forms).
- **`layout/`**: Structural components like headers.
- **`settings/`**: Application settings dialogs.

### `src/context`
Global state management using React Context.
- `EventsContext.tsx`: Manages event data and period state.

### `src/lib`
Utility functions and core logic.
- `calendar-logic.ts`: The core algorithm for calculating grid layouts.
- `utils.ts`: General helpers (clsx/tailwind-merge).
- `mock-data.ts`: Static data for prototyping.

### `src/types`
TypeScript definitions.
- `calendar.ts`: Shared interfaces for Calendar, Event, Period, etc.

## Source Tree

```
life-calendar/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── app/             # Authenticated app routes
│   │   ├── mentions-legales/# Static page
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/          # React Components
│   │   ├── calendar/        # Grid & Visualization
│   │   ├── events/          # Event management
│   │   ├── ui/              # Reusable UI kit
│   │   └── layout/          # App shell
│   ├── context/             # React Context (State)
│   ├── lib/                 # Logic & Utils
│   └── types/               # TypeScript Interfaces
├── public/                  # Static assets
└── package.json             # Dependencies
```
