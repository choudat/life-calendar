# Life Calendar - Project Context & Copilot Instructions

## 🧠 Project Core
**Life Calendar** is a "Biographer" SaaS that visualizes a human life in a grid of 4,680 weeks (90 years).
- **Core Value:** Mortality motivation + Memory preservation.
- **Key UX:** "The Grid" (Zoomable/Scrollable), Color-coded Life Categories (Career, Health, Love).

## 🛠 Tech Stack (Architecture Locked)
| Domain | Technology | Version / Note |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15** (App Router) | Server Actions, React 19 standards. |
| **Language** | **TypeScript** | Strict mode. No `any`. |
| **Database** | **Neon** (Serverless Postgres) | HTTP Driver for Edge compatibility. |
| **ORM** | **Drizzle ORM** | `drizzle-kit` for migrations. `snake_case` DB, `camelCase` TS. |
| **State/Sync** | **TanStack Query** (v5) | `persistClient` for Offline support. |
| **Visualization**| **TanStack Virtual** | Headless virtualization for the 4k-node grid. |
| **Styling** | **Tailwind CSS v4** | Native structure. No `tailwind.config.ts`. CSS Variables for theme. |
| **Auth** | **Clerk** | Middleware integration. |

## 🏗 Project Structure
```text
src/
├── app/
│   ├── (auth)/             # Clerk Auth routes (login/signup)
│   ├── (tool)/             # Main tool shell (Sidebar + Grid)
│   │   ├── layout.tsx      # AppShell (Providers: QueryClient)
│   │   └── page.tsx        # Dashboard
│   ├── api/                # Webhooks only (e.g., Clerk Sync)
│   └── globals.css         # Tailwind v4 imports + CSS Variables
├── components/
│   ├── ui/                 # Atomic Shadcn components (dumb)
│   ├── calendar/           # Domain Components (LifeGrid, WeekCell)
│   └── layout/             # Organize generic layout components
├── db/                     # Drizzle Source of Truth
│   ├── index.ts            # Client export
│   └── schema.ts           # All table definitions
├── server/
│   └── actions/            # Server Actions (Mutations only!)
└── lib/
    ├── date-logic.ts       # Centralized Week Math
    └── utils.ts            # Class merging
```

## 📐 Critical Coding Patterns

### 1. Server Actions (Mutations)
**Pattern:** "Hybrid Response"
- **Logic Errors:** Return `{ success: false, error: "Msg" }`. Handled by UI toast.
- **System Errors:** `throw new Error()`. Handled by Sentry/Error Boundaries.
```typescript
// Example Signature
export async function updateEvent(data: Input): Promise<ActionResponse<Event>>
```

### 2. State Management (TanStack Query)
- **Do not use `useEffect` for data fetching.**
- **Optimistic UI:** Always implement `onMutate` to update the cache instantly.
- **Persistence:** All "Grid Data" queries must use `persistClient` to `localStorage`.

### 3. The Grid (Virtualization)
- **Pattern:** Computed Sparse View.
- **Rule:** Do NOT store empty weeks in DB.
- **Render:** Map `(weekIndex)` -> `Ref<UserEvent | undefined>`.
- **Performance:** Use `TanStack Virtual`. Do not render 4,000 components at once.

### 4. Styling (Tailwind v4)
- **Zero Configuration:** Don't look for `tailwind.config.js`.
- **Dynamic Values:** Use inline styles for dynamic coordinates, classes for static tokens.
- **Theme:** Use `var(--color-career-500)` format for category colors.

## 🧪 Testing Strategy
- **Unit:** Co-located. `src/components/calendar/week-cell.test.tsx` lives next to the component.
- **E2E:** `tests/e2e` folder for Playwright flows.

## 🚨 Anti-Patterns (Do Not Use)
1.  **Prisma:** Refused. Use Drizzle.
2.  **Moment.js:** Refused. Use `date-fns`.
3.  **Global Store:** Avoid Redux/Zustand. Use TanStack Query for server state.
4.  **Client-Side Fetching:** Do not use `fetch()` in `useEffect`. Use Server Components or Queries.
