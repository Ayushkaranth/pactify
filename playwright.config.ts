import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  // --- THIS IS THE DEFINITIVE FIX ---
  // We are now telling Playwright to use the development server,
  // which does not require a separate build step. This is the correct
  // and most robust pattern for local end-to-end testing.
  webServer: {
    command: 'npm run dev', // Changed from 'npm run start'
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});