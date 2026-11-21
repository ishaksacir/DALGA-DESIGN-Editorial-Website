import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env.QA_BASE_URL ?? 'http://localhost:5173'
const OUT = 'qa-output'

const desktop = devices['Desktop Chrome']
const mobile = { ...devices['Pixel 7'], defaultBrowserType: 'chromium' as const }

export default defineConfig({
  testDir: 'tests',
  outputDir: `${OUT}/test-results`,
  snapshotPathTemplate: 'baselines/{projectName}/{testFilePath}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: Number(process.env.QA_RETRIES ?? 1),
  workers: process.env.QA_WORKERS ? Number(process.env.QA_WORKERS) : undefined,
  timeout: 60_000,
  expect: { timeout: 8_000, toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
  reporter: [
    ['list'],
    ['html', { outputFolder: `${OUT}/html-report`, open: 'never' }],
    ['json', { outputFile: `${OUT}/results.json` }],
  ],
  use: {
    baseURL: BASE_URL,
    locale: 'en-US',
    timezoneId: 'Europe/Sarajevo',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
    serviceWorkers: 'block',
  },
  projects: [
    {
      name: 'desktop-1440',
      use: { ...desktop, viewport: { width: 1440, height: 900 } },
      testMatch: /(functional|a11y|runtime|responsive|visual)\/.*\.spec\.ts/,
      grepInvert: /@phone|@compact/,
    },
    {
      name: 'desktop-1920',
      use: { ...desktop, viewport: { width: 1920, height: 1080 } },
      testMatch: /responsive\/.*\.spec\.ts/,
    },
    {
      name: 'tablet-768',
      use: { ...desktop, viewport: { width: 768, height: 1024 }, hasTouch: true },
      testMatch: /(functional|responsive)\/.*\.spec\.ts/,
      grep: /@compact|@responsive|@any/,
    },
    {
      name: 'mobile-390',
      use: { ...mobile, viewport: { width: 390, height: 844 } },
      testMatch: /(functional|responsive|visual|a11y)\/.*\.spec\.ts/,
      grep: /@phone|@responsive|@visual|@any/,
    },
    {
      name: 'mobile-375',
      use: { ...mobile, viewport: { width: 375, height: 812 } },
      testMatch: /(functional|responsive)\/.*\.spec\.ts/,
      grep: /@phone|@responsive|@any/,
    },
  ],
  webServer: process.env.QA_NO_SERVER
    ? undefined
    : {
        command: 'npm --prefix .. run dev:site',
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120_000,
        stdout: 'ignore',
        stderr: 'pipe',
      },
})
