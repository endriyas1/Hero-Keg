import { expect, test, type Page } from '@playwright/test';

const routes: Array<[path: string, title: RegExp]> = [
  ['/', /^Hero Keg Service & Trading PLC – Mobile Keg Maintenance/],
  ['/about', /^About Us – /],
  ['/services', /^Brewery Keg Services/],
  ['/contact', /^Contact Hero Keg/],
  ['/why-choose-us', /^Why Choose Hero Keg/],
  ['/sitemap', /^Site Index & Directory/],
];

// Only the site's own requests count: third-party embeds (the Google Maps
// iframe on /contact) depend on outside network access.
const isOwn = (url: string) => url.startsWith('http://127.0.0.1:3000/');

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error' && isOwn(msg.location().url || page.url())) errors.push(`console: ${msg.text()}`);
  });
  page.on('requestfailed', (req) => {
    if (isOwn(req.url())) errors.push(`requestfailed: ${req.url()}`);
  });
  page.on('response', (res) => {
    if (isOwn(res.url()) && res.status() >= 400) errors.push(`HTTP ${res.status()}: ${res.url()}`);
  });
  return errors;
}

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

for (const [path, title] of routes) {
  test(`direct navigation to ${path} renders its page without errors or overflow`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1').first()).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);

    // A browser refresh lands on the same page.
    await page.reload();
    await expect(page).toHaveTitle(title);
  });
}

test('unknown paths fall back to the home page rather than an error', async ({ page }) => {
  await page.goto('/no-such-page');
  await expect(page).toHaveTitle(routes[0][1]);
});

test('back and forward navigation keeps the URL and page in sync', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.locator('#mobile-menu').getByRole('link', { name: 'Services' }).click();
  } else {
    await page.getByRole('navigation').getByRole('link', { name: 'Services' }).first().click();
  }
  await expect(page).toHaveURL(/\/services$/);
  await expect(page).toHaveTitle(routes[2][1]);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page).toHaveTitle(routes[0][1]);
  await page.goForward();
  await expect(page).toHaveTitle(routes[2][1]);
});

test('mobile menu is operable and reports its state to assistive tech', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu button only shows on small screens');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#mobile-menu').getByRole('link', { name: 'Contact Us' }).first().click();
  await expect(page).toHaveTitle(routes[3][1]);
  await expect(page.locator('#mobile-menu')).toHaveCount(0);
});

test('external links open safely (noopener)', async ({ page }) => {
  for (const path of ['/contact', '/']) {
    await page.goto(path);
    const unsafe = await page.$$eval('a[target="_blank"]', (links) =>
      links.filter((a) => !/noopener/.test(a.getAttribute('rel') ?? '')).map((a) => a.getAttribute('href')),
    );
    expect(unsafe).toEqual([]);
  }
});
