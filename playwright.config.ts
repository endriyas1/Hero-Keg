import { defineConfig, devices } from '@playwright/test';

// Runs against a local production build only. nodemailer is replaced by the
// capture stub, so no email is ever sent and no real credentials are used.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node --require ./tests/helpers/mock-nodemailer.cjs dist/server.cjs',
    url: 'http://127.0.0.1:3000/robots.txt',
    reuseExistingServer: false,
    env: {
      NODE_ENV: 'production',
      GMAIL_USER: 'sender@example.test',
      GMAIL_APP_PASSWORD: 'synthetic-test-password',
      CONTACT_RECIPIENT_EMAIL: 'inbox@example.test',
      MAIL_CAPTURE_FILE: 'test-results/e2e-mail.jsonl',
    },
  },
  // Firefox and WebKit are not installed in the audit environment; add
  // devices['Desktop Firefox'] / devices['Desktop Safari'] where they are.
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
