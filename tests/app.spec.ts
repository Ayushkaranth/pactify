import { test, expect } from '@playwright/test';

test('should load the landing page and display the main heading', async ({ page }) => {
  // 1. Go to the homepage
  await page.goto('/');

  // 2. Find the main heading by its text content
  const mainHeading = page.getByRole('heading', { name: 'Beyond Promises. Verifiable Proof.' });

  // 3. Assert that the heading is visible on the page
  await expect(mainHeading).toBeVisible();
});

test('should navigate to the sign-in page', async ({ page }) => {
    // 1. Go to the homepage
    await page.goto('/');

    // 2. Find the "Sign In" button and click it
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 3. Assert that the URL is now the sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
});