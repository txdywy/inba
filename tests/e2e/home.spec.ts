import { expect, test } from '@playwright/test';

test('homepage renders the live hub sections on mobile', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /playoff race tightens/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /today's games/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /standings — east/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Playoff picture', exact: true })).toBeVisible();
});