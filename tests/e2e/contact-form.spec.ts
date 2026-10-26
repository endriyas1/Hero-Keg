import { expect, test, type Page } from '@playwright/test';

const inquiry = {
  name: 'Test Person',
  company: 'Synthetic Brewery Ltd',
  email: 'test.person@example.test',
  phone: '+251 900 000 000',
  subject: 'Quote request',
  message: 'Synthetic e2e message.',
};

async function fillForm(page: Page, { agree = true } = {}) {
  for (const [name, value] of Object.entries(inquiry)) {
    await page.locator(`form [name="${name}"]`).fill(value);
  }
  if (agree) await page.locator('form [name="agreed"]').check();
}

const submit = (page: Page) => page.getByRole('button', { name: /Send Inquiry/ });

function countContactRequests(page: Page) {
  const counter = { count: 0 };
  page.on('request', (req) => {
    if (req.url().endsWith('/api/contact') && req.method() === 'POST') counter.count++;
  });
  return counter;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/contact');
});

test('a valid inquiry goes through the real API and the form is cleared', async ({ page }) => {
  await fillForm(page);
  await submit(page).click();
  await expect(page.getByText('Message Sent Successfully!')).toBeVisible();
  await expect(page.locator('form [name="name"]')).toHaveValue('');
  await expect(page.locator('form [name="agreed"]')).not.toBeChecked();
});

test('empty required fields block submission in the browser', async ({ page }) => {
  const requests = countContactRequests(page);
  await submit(page).click();
  await page.waitForTimeout(300);
  expect(requests.count).toBe(0);
  expect(await page.locator('form [name="name"]').evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
});

test('the consent checkbox is required before anything is sent', async ({ page }) => {
  const requests = countContactRequests(page);
  await fillForm(page, { agree: false });
  await submit(page).click();
  await expect(page.getByText('You must agree to be contacted about your inquiry.')).toBeVisible();
  expect(requests.count).toBe(0);
});

test('double-clicking submit sends exactly one request', async ({ page }) => {
  await page.route('**/api/contact', async (route) => {
    await new Promise((r) => setTimeout(r, 800));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: 'ok' }) });
  });
  const requests = countContactRequests(page);
  await fillForm(page);
  await submit(page).dblclick();
  await expect(page.getByRole('button', { name: /Sending Inquiry/ })).toBeDisabled();
  await expect(page.getByText('Message Sent Successfully!')).toBeVisible();
  expect(requests.count).toBe(1);
});

test('a server error shows the server message and keeps what the user typed', async ({ page }) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, message: "We couldn't send your inquiry right now." }),
    }),
  );
  await fillForm(page);
  await submit(page).click();
  await expect(page.getByText('Submission Error')).toBeVisible();
  await expect(page.getByText("We couldn't send your inquiry right now.")).toBeVisible();
  await expect(page.locator('form [name="message"]')).toHaveValue(inquiry.message);
  await expect(submit(page)).toBeEnabled();
});

test('the rate-limit reply is shown to the user', async ({ page }) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Too many submissions from your connection.' }),
    }),
  );
  await fillForm(page);
  await submit(page).click();
  await expect(page.getByText('Too many submissions from your connection.')).toBeVisible();
});

test('a network failure is reported and the user can retry successfully', async ({ page }) => {
  let attempt = 0;
  await page.route('**/api/contact', (route) => {
    attempt++;
    if (attempt === 1) return route.abort('internetdisconnected');
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: 'ok' }) });
  });
  await fillForm(page);
  await submit(page).click();
  await expect(page.getByText(/Unable to connect to the server/)).toBeVisible();
  await expect(page.locator('form [name="email"]')).toHaveValue(inquiry.email);
  await submit(page).click();
  await expect(page.getByText('Message Sent Successfully!')).toBeVisible();
  expect(attempt).toBe(2);
});

// Finding F-09: proxies and Express return HTML for 413/502/etc., and the form
// then blames the user's network.
test('a non-JSON error response is not reported as a network problem', async ({ page }) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 502, contentType: 'text/html', body: '<html><body>Bad Gateway</body></html>' }),
  );
  await fillForm(page);
  await submit(page).click();
  await expect(page.getByText('Submission Error')).toBeVisible();
  await expect(page.getByText('Message Sent Successfully!')).toHaveCount(0);
  await expect(page.getByText(/check your network connection/)).toHaveCount(0);
});

test('the honeypot field is hidden from people and from keyboard navigation', async ({ page }) => {
  const honeypot = page.locator('form [name="website"]');
  await expect(honeypot).toHaveAttribute('tabindex', '-1');
  await expect(honeypot).not.toBeInViewport();
  expect(await honeypot.evaluate((el) => !!el.closest('[aria-hidden="true"]'))).toBe(true);
});

// Finding F-10: labels are not associated with their inputs.
test('every visible form control has an accessible label', async ({ page }) => {
  for (const label of ['Full Name', 'Company Name', 'Email Address', 'Phone Number', 'Service Required', 'Subject', 'Message']) {
    await expect(page.getByLabel(label, { exact: false }).first()).toBeVisible();
  }
});
