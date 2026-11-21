import { existsSync } from 'node:fs'
import { test, expect } from '../../fixtures/test'
import { open } from '../../helpers/page'

const PAGES = [
  { id: 'home', path: '/' },
  { id: 'catalogue', path: '/catalogue' },
  { id: 'product', path: '/catalogue/ink-wrap-top' },
  { id: 'one-of-one', path: '/one-of-one' },
  { id: 'about', path: '/about' },
]

for (const p of PAGES) {
  test(`visual baseline ${p.id} @visual`, async ({
    page,
    api,
    runtime,
    cover,
    unverified,
  }, testInfo) => {
    cover('VIS-BASE')
    runtime.allow(/.*/)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await open(page, p.path)
    await page.waitForTimeout(800)
    const name = `${p.id}.png`
    const updating =
      testInfo.config.updateSnapshots === 'all' || testInfo.config.updateSnapshots === 'changed'
    if (!existsSync(testInfo.snapshotPath(name)) && !updating) {
      unverified(
        'VIS-BASE',
        `No approved baseline for ${p.id} (${testInfo.project.name}). Run "npm run qa:baseline" after reviewing the screenshots to approve one.`,
      )
      test.skip(true, 'no approved baseline yet')
    }
    await expect(page).toHaveScreenshot(name, {
      fullPage: false,
      mask: [page.locator('.atelier-news'), page.locator('.ph-news-card')],
    })
  })
}
