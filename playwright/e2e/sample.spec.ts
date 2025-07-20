import { test, expect } from '@playwright/test';

test.describe('Sample E2E Tests', () => {
  test('should load the frontend application', async ({ page }) => {
    // Navigate to the frontend
    await page.goto('/');
    
    // Check that the page loads successfully
    await expect(page).toHaveTitle(/Vite \+ React/);
    
    // Wait for React to render - check that the root div has content
    await expect(page.locator('#root')).not.toBeEmpty();
    
    // Verify React routing is working by checking for rendered content
    await expect(page.locator('#root > *')).toBeVisible(); // Any child element in root means React rendered
  });

  test('should be able to reach the backend API', async ({ request }) => {
    // Test that the Laravel API is accessible - public endpoint should work
    const healthResponse = await request.get('http://back-end:8000/api/health');
    expect(healthResponse.status()).toBe(200);
    
    // Test that auth protection works - protected endpoint should reject unauth'd requests
    const userResponse = await request.get('http://back-end:8000/api/user');
    expect([401, 403]).toContain(userResponse.status());
  });

  test('should handle navigation between frontend routes', async ({ page }) => {
    await page.goto('/');
    
    // If there are navigation elements, test them
    // This is a placeholder - adjust based on your actual routes
    const homeIndicator = page.locator('body');
    await expect(homeIndicator).toBeVisible();
  });
});