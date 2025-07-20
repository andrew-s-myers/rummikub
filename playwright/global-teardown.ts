import { FullConfig } from '@playwright/test';

/**
 * Global teardown for Playwright E2E tests
 * Simple cleanup for containerized environment
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 E2E test environment cleaned up!');
}

export default globalTeardown;