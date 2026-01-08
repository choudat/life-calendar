# Automation Testing Guide

This project uses [Playwright](https://playwright.dev/) for End-to-End (E2E) testing.

## Prerequisites

1.  **Environment Variables**:
    Ensure your `.env.local` contains the necessary database and authentication keys.
    
    For the Regression Test (which logs in), you must provide a valid test user:
    ```bash
    # .env.local
    TEST_EMAIL=test@example.com
    TEST_PASSWORD=your_secure_password
    ```

2.  **Install Browsers**:
    ```bash
    npx playwright install
    ```

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test
```bash
npx playwright test tests/regression.spec.ts
```

### Debugging (UI Mode)
If you want to watch the test run or debug why it fails:
```bash
npx playwright test --ui
```
This is useful for manually handling login if you don't want to store credentials.

## Test Suite

-   **`tests/public.spec.ts`**: Verifies public pages (Legal, Landing) load correctly.
-   **`tests/regression.spec.ts`**: **Critical Path**. Verifies:
    -   Creating a Calendar ("Persisted to DB").
    -   Editing/Reordering Calendars.
    -   Creating an Event inside that Calendar.
    -   **Verifying Visibility** of the new event (Regression Check).
    -   Deleting Events and Calendars.

## Notes
-   The tests run against the *local development server* (`npm run dev`) by default.
-   Authentication is handled by filling the Clerk login form if detected.
