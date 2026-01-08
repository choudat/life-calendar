# Architecture & Pattern Decisions

## 1. Testing Strategy
**Decision:** Co-located Tests
**Rationale:** 
- Improves visibility of test coverage.
- Reduces context switching during development.
- Aligns with modern component-based architecture.
- **Exception:** E2E tests (Playwright/Cypress) will reside in a top-level `e2e` or `tests` folder.

**Pattern:**
- `src/components/ui/Button.tsx`
- `src/components/ui/Button.test.tsx`

## 2. Error Handling in Server Actions
**Decision:** Hybrid (Return Object for Logic, Throw for System)
**Rationale:**
- **Validation/Logic Errors:** Return a structured object (e.g., `{ success: false, message: "Invalid email" }`). This works best with React 19's `useActionState` and form handling, allowing inline feedback without crashing the UI.
- **System/Critical Errors:** Throw exceptions (e.g., Database connection failed). These should be caught by top-level Error Boundaries (`error.tsx`) or observability middleware (Sentry).

**Pattern (Server Action):**
```typescript
export async function myAction(prevState: any, formData: FormData) {
  try {
    const validated = schema.safeParse(formData);
    if (!validated.success) {
      return { success: false, errors: validated.error.flatten() };
    }
    // Business logic
    return { success: true, data: result };
  } catch (error) {
    // Let unexpected errors bubble up to error.tsx or handle critically
    console.error(error);
    throw new Error("System failure"); 
  }
}
```
