import { test, expect } from '@playwright/test';

// Constants for test data
const TIMESTAMP = Date.now();
const TEST_CALENDAR = {
  title: `Playwright Test Calendar ${TIMESTAMP}`,
  updatedTitle: `Updated Playwright Calendar ${TIMESTAMP}`,
};

const TEST_EVENT = {
  title: `Test Automated Event ${TIMESTAMP}`,
  date: '1908-01-01', // Should be within grid range (Age 1)
};

test.describe('Life Calendar Regression Test', () => {
    
  test.beforeEach(async ({ page }) => {
    await page.goto('/app');
    
    // Robust detection of Login vs Dashboard
    // We expect either the App Header (Dashboard) or a Login Form
    
    // Wait for something to load
    try {
        await expect(page.locator('header, input[name="identifier"]')).toBeVisible({ timeout: 10000 });
    } catch (e) {
        console.log("Timed out waiting for initial load");
    }

    const emailInput = page.locator('input[name="identifier"]');
    
    if (await emailInput.isVisible()) {
        console.log('Login form detected. Attempting login...');
        const email = process.env.TEST_EMAIL;
        const password = process.env.TEST_PASSWORD;

        if (email && password) {
            await emailInput.fill(email);
            // Submit email
            await page.getByRole('button', { name: /Continue|Continuer/i }).click();
            
            // Wait for password input
            const passwordInput = page.locator('input[name="password"]');
            await passwordInput.waitFor({ state: 'visible' });
            await passwordInput.fill(password);
            
            // Submit password
            await page.getByRole('button', { name: /Continue|Continuer|Se connecter|Sign in/i }).click();
            
            // Wait for app to load
            await page.waitForURL('**/app', { timeout: 20000 });
        } else {
            console.warn('⚠️ Login required but MOCK_EMAIL/MOCK_PASSWORD not set in env.');
        }
    } else {
        console.log('No login form detected - assuming already logged in or generic error');
    }
  });

  test('Complete Lifecycle: Calendar & Event Management', async ({ page }) => {
    // 0. Ensure we are on the dashboard
    await expect(page.getByRole('banner')).toBeVisible({ timeout: 15000 });
    console.log("Reached Dashboard");

    // 1. Open Calendar Management
    await page.getByTitle('Gérer les calendriers').click();
    await expect(page.getByText('Gérer les calendriers', { exact: true })).toBeVisible();

    // 2. Add New Calendar
    await page.getByRole('button', { name: 'Ajouter un calendrier' }).click();
    await page.getByPlaceholder('Ex: Travail, Santé...').fill(TEST_CALENDAR.title);
    
    // Select a color (using specific title to be robust)
    // The form generates buttons with titles like "slate-500", "red-500", etc.
    // We try to click the first available color or a specific one.
    const colorButton = page.locator('button[title="slate-500"]').first();
    await colorButton.click();
    
    await page.getByRole('button', { name: 'Créer' }).click();

    // Verify it exists in the list. 
    // Note: It might also appear in the dashboard background if "Manage" dialog is semi-transparent,
    // causing strict mode violation. We target the specific span in the list.
    await expect(page.locator('span', { hasText: TEST_CALENDAR.title }).first()).toBeVisible();

    // 3. Reorder (Move Up/Down)
    // We must ensure we target the row INSIDE the dialog, not the background chips.
    // The dialog container usually has the title "Gérer les calendriers" or similar context.
    // Or we simply use a more specific selector for the row structure.
    // Row classes: "flex items-center justify-between p-2 rounded-lg border border-slate-100"
    
    const dialogContent = page.locator('.fixed.inset-0', { hasText: 'Gérer les calendriers' });
    const calendarRow = dialogContent.locator('div.flex.justify-between.border-slate-100', { hasText: TEST_CALENDAR.title });
    
    // Check buttons exist inside this row
    await expect(calendarRow.getByRole('button').first()).toBeVisible();
    
    // 4. Edit Calendar (Rename)
    // Buttons: [Up, Down, Edit, Trash] -> nth(2) is Edit
    await calendarRow.getByRole('button').nth(2).click();
    await page.getByPlaceholder('Ex: Travail, Santé...').fill(TEST_CALENDAR.updatedTitle);
    await page.getByRole('button', { name: 'Mettre à jour' }).click();
    
    // Verify Update: Relax strictness or target the Chip explicitly
    await expect(page.locator('span', { hasText: TEST_CALENDAR.updatedTitle }).first()).toBeVisible();

    // Close Settings Dialog
    // The dialog-simple uses a generic button with an X icon, no aria-label.
    // We can target the 'X' icon or click outside. Pressing Escape is robust.
    await page.keyboard.press('Escape');
    
    // Ensure Dialog is GONE before clicking grid
    await expect(page.getByText('Mettre à jour')).not.toBeVisible();

    // 5. Add Event in the new Calendar
    // We need to click a cell. The cells have a title attribute like "15/01/1980 - Age: 10"
    // We pick the first one available.
    // Selector: div[title*="Age:"]
    const cell = page.locator('div[title*="Age:"]').first();
    await expect(cell).toBeVisible(); // Ensure grid is rendered
    await cell.click(); 
    
    // Now the "WeekDetailDialog" should be open (or we clicked to open modal)
    // Wait for "Ajouter un événement" button
    await page.getByRole('button', { name: 'Ajouter un événement' }).click();
    
    await page.getByPlaceholder('Ex: Voyage au Japon, Nouveau Job...').fill(TEST_EVENT.title);
    
    // Explicitly set date to ensuring it's recent and valid
    await page.locator('input[type="date"]').first().fill(TEST_EVENT.date);

    await page.getByPlaceholder('✈️').fill('🤖');
    // Select the category
    await page.locator('select').selectOption({ label: TEST_CALENDAR.updatedTitle });
    
    // Wait for validation/state update
    await page.waitForTimeout(500);

    // Submit
    await page.getByRole('button', { name: 'Enregistrement...' }).or(page.getByRole('button', { name: 'Créer' })).click();

    // The Dialog might close completely if a full revalidation occurs (resetting selectedCell), 
    // or revert to Read Mode. We handle both cases by simply ensuring the Edit Form is gone.
    await expect(page.getByRole('button', { name: 'Enregistrement...' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer' })).not.toBeVisible();
    
    // Close the dialog if it's still open (Read Mode)
    // We check if the dialog container is visible.
    const dialogOpen = await page.locator('[role="dialog"]').isVisible().catch(() => false);
    if (dialogOpen) {
        await page.keyboard.press('Escape');
    }
    
    // Ensure ALL dialogs and overlays are gone
    // Check for the specific Shadcn overlay class or role
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    await expect(page.locator('.fixed.inset-0.z-50.bg-black\\/80')).not.toBeVisible(); // Escaped forward slash

    // Verify Event appears
    // We check List View first as it's more reliable for text content verification
    // ViewSelector uses simple buttons, not tabs.
    await page.getByRole('button', { name: 'Liste' }).click();
    
    // There might be duplicates from previous failed runs remaining in the DB.
    // The previous runs failed because they found the HIDDEN mobile view element (EventCard) first.
    // We strictly target the Desktop Table View to ensure we check visibility correctly on Desktop.
    // Desktop view uses a Table structure.
    const desktopTable = page.locator('table');
    const desktopRow = desktopTable.locator('tr').filter({ hasText: TEST_EVENT.title }).first();
    
    // Debugging: Print visible text if not found
    if (!await desktopRow.isVisible()) {
        console.log("Desktop Row not found. Page content:");
        // ... (optional debug log)
    }
    await expect(desktopRow).toBeVisible();

    // Verify Icon in Grid View
    // Make sure we are in Weeks view (since we might be in list view from previous check)
    await page.getByRole('button', { name: 'Semaine' }).first().click();
    
    // Ensure "Show All" is clicked if visible AND enabled
    const showAllBtn = page.getByTitle('Tout afficher');
    if (await showAllBtn.isVisible() && !(await showAllBtn.isDisabled())) {
        await showAllBtn.click();
    }

    // Grid might take a moment to virtually render
    await page.waitForTimeout(1000); 

    // Find the cell with the icon
    // The icon is inside a span text-md/sm
    await expect(page.getByText('🤖').first()).toBeVisible();

    // Switch to List View to verify Title
    // ViewSelector uses simple buttons. "Liste".
    await page.getByRole('button', { name: 'Liste' }).click();
    
    await expect(desktopRow).toBeVisible();

    // 6. Delete Event
    // We are in List View (Desktop Table).
    // Buttons in row: [Edit, Trash]
    page.once('dialog', dialog => dialog.accept());
    // Use the desktopRow we found earlier
    await desktopRow.getByRole('button').nth(1).click(); // 1 = Delete
    
    await expect(desktopRow).not.toBeVisible();
    
    // Switch back to Weeks for Calendar deletion logic context? 
    // Calendar deletion is done globally via Settings, so view doesn't matter.

    // 7. Delete Calendar
    await page.getByTitle('Gérer les calendriers').click();
    
    // Locate the custom dialog overlay
    const dialogOverlay = page.locator('.fixed.inset-0', { hasText: 'Gérer les calendriers' });
    await expect(dialogOverlay).toBeVisible();

    // Explicitly target the row container matches classes inside the dialog
    // We use .p-2 to distinguish from other elements like header
    const targetRow = dialogOverlay.locator('div.flex.justify-between.p-2', { hasText: TEST_CALENDAR.updatedTitle });
    await expect(targetRow).toBeVisible();

    const deleteBtn = targetRow.getByRole('button').last();
    // Ensure we are clicking the Trash button (usually red hover or last)
    await expect(deleteBtn).toBeVisible();

    page.once('dialog', dialog => {
        console.log(`Dialog encountered: ${dialog.message()}`);
        dialog.accept();
    });
    
    await deleteBtn.click();
    
    // Verify row is gone
    await expect(targetRow).not.toBeVisible();
    
    // Verify Calendar is gone from global view (Chip)
    await expect(page.getByText(TEST_CALENDAR.updatedTitle)).not.toBeVisible();
  });
});
