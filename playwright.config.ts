import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Laravel + React E2E testing
 * 
 * Prerequisites: 
 * - Run `make dev` to start Docker services before running E2E tests
 * - Frontend should be available at http://localhost:5173
 * - Backend API should be available at http://localhost:8000
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './playwright/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.FRONTEND_BASE_URL || 'http://front-end-web:5173',
    /* API base URL for backend calls */
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Record video on retry */
    video: 'retain-on-failure',
  },

  /* Global setup and teardown for test data management */
  // globalSetup: require.resolve('./playwright/global-setup.ts'),
  // globalTeardown: require.resolve('./playwright/global-teardown.ts'),

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* Test against mobile viewports */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    // Firefox, WebKit, and Mobile Safari excluded due to Docker containerization
    // network connectivity issues. These browsers work fine in production but
    // cannot reach frontend service from within Playwright Docker container.
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Output directories */
  outputDir: 'playwright/test-results',
  
  /* Timeout settings */
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
});