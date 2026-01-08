import { test, expect } from '@playwright/test';

test('Legal Page loads correctly', async ({ page }) => {
  await page.goto('/mentions-legales');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('Landing Page (or Redirect) works', async ({ page }) => {
  await page.goto('/');
  // Either we see the "Life Calendar" title OR we are redirected to sign-in
  const title = page.getByText('Life Calendar');
  const signIn = page.getByText(/sign in|se connecter/i);
  
  // Expect at least one to be visible
  await expect(title.or(signIn).first()).toBeVisible();
});
