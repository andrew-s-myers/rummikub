import { FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright E2E tests
 * Waits for services to be ready before running tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🔧 Setting up E2E test environment...');
  
  try {
    // Wait for services to be ready
    console.log('⏳ Waiting for Docker services...');
    await waitForServices();
    
    console.log('✅ E2E test environment ready!');
  } catch (error) {
    console.error('❌ Failed to setup E2E test environment:', error);
    throw error;
  }
}

/**
 * Wait for Docker services to be ready
 */
async function waitForServices(): Promise<void> {
  const maxRetries = 30;
  const delay = 1000; // 1 second
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Check if frontend is responding
      const frontendResponse = await fetch('http://front-end-web:5173');
      
      // Check if backend API is responding using health endpoint
      const backendResponse = await fetch('http://back-end:8000/api/health');
      
      console.log(`Frontend status: ${frontendResponse.status}, Backend status: ${backendResponse.status}`);
      
      if (frontendResponse.ok && backendResponse.ok) {
        console.log('✅ Services are ready!');
        return;
      }
    } catch (error) {
      // Services not ready yet
      console.log(`⏳ Waiting for services... (attempt ${i + 1}/${maxRetries}), error: ${error.message}`);
    }
    
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Services did not start within expected time');
}

export default globalSetup;