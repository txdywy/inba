import { expect, test } from '@playwright/test';

test('homepage renders the live hub sections on mobile', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /playoff picture taking shape/i, level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: /today's games/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /standings — east/i })).toBeVisible();
  await expect(page.getByText(/bracket tree, momentum cards, and star watch/i)).toBeVisible();
});