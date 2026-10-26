import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { postContact, RECIPIENT, startServer, validInquiry, type TestServer } from '../helpers/server';

// The server trusts one proxy hop (`trust proxy = 1`), as on Cloud Run where the
// front end appends the caller's address to X-Forwarded-For. Each test sends a
// distinct "proxy-appended" address so the per-IP rate limit doesn't leak
// between tests.
let nextIp = 1;
const asClient = () => ({ 'X-Forwarded-For': `203.0.113.${nextIp++}` });

describe('POST /api/contact — input handling', () => {
  let server: TestServer;
  beforeAll(async () => {
    server = await startServer();
  });
  afterAll(() => server.stop());

  it('accepts a valid inquiry and delivers exactly one email to the configured inbox', async () => {
    const before = server.sentMail().length;
    const res = await postContact(validInquiry, asClient());
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ success: true });
    const sent = server.sentMail().slice(before);
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe(RECIPIENT);
    expect(sent[0].replyTo).toBe(validInquiry.email);
  });

  it('HTML-escapes every submitted field in the email body', async () => {
    const payload = '<img src=x onerror=alert(1)><script>alert(2)</script>"\'&';
    const before = server.sentMail().length;
    const res = await postContact(
      {
        name: payload,
        company: payload,
        email: 'xss@example.test',
        phone: payload,
        service: payload,
        kegs: payload.slice(0, 20),
        subject: payload,
        message: payload,
      },
      asClient(),
    );
    expect(res.status).toBe(200);
    const [mail] = server.sentMail().slice(before);
    expect(mail.html).not.toContain('<img');
    expect(mail.html).not.toContain('<script');
    expect(mail.html).not.toContain(payload);
    expect(mail.html).toContain('&lt;script&gt;');
    // Quotes are escaped too, so values inside href="tel:…"/"mailto:…" can't break out of the attribute.
    expect(mail.html).toContain('&quot;&#39;&amp;');
    expect(mail.html).not.toMatch(/href="(tel|mailto):[^"]*"[^>]*on\w+=/i);
  });

  it('strips CR/LF from values that end up in mail headers', async () => {
    const before = server.sentMail().length;
    await postContact(
      {
        ...validInquiry,
        name: 'Evil\r\nBcc: victim@example.test',
        company: 'Co"\r\nX-Injected: 1',
        subject: 'Hello\r\nBcc: victim@example.test',
      },
      asClient(),
    );
    const [mail] = server.sentMail().slice(before);
    expect(mail.subject).not.toMatch(/[\r\n]/);
    expect(mail.from).not.toMatch(/[\r\n]/);
    // The display name must stay a single quoted string with no embedded quotes.
    expect(mail.from).toMatch(/^"[^"]*" <sender@example\.test>$/);
    expect(mail).not.toHaveProperty('bcc');
  });

  it('ignores attacker-supplied routing fields (mass assignment)', async () => {
    const before = server.sentMail().length;
    await postContact(
      {
        ...validInquiry,
        to: 'attacker@example.test',
        recipient: 'attacker@example.test',
        bcc: 'attacker@example.test',
        cc: 'attacker@example.test',
        from: 'ceo@example.test',
        attachments: [{ path: '/etc/passwd' }],
      },
      asClient(),
    );
    const [mail] = server.sentMail().slice(before);
    expect(mail.to).toBe(RECIPIENT);
    expect(mail).not.toHaveProperty('bcc');
    expect(mail).not.toHaveProperty('cc');
    expect(mail).not.toHaveProperty('attachments');
    expect(mail.from).toContain('<sender@example.test>');
  });

  it.each([
    ['name'],
    ['company'],
    ['email'],
    ['phone'],
    ['subject'],
    ['message'],
  ])('rejects a submission missing required field "%s" without sending mail', async (field) => {
    const before = server.sentMail().length;
    const body: Record<string, unknown> = { ...validInquiry };
    delete body[field];
    const res = await postContact(body, asClient());
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ success: false });
    expect(server.sentMail().length).toBe(before);
  });

  it('treats non-string field values as missing instead of crashing', async () => {
    const before = server.sentMail().length;
    const res = await postContact(
      { ...validInquiry, name: ['a', 'b'], message: { toString: 'x' }, email: 42 },
      asClient(),
    );
    expect(res.status).toBe(400);
    expect(server.sentMail().length).toBe(before);
  });

  it('rejects whitespace-only required fields', async () => {
    const res = await postContact({ ...validInquiry, name: '   ', message: '\n\t' }, asClient());
    expect(res.status).toBe(400);
  });

  it.each([
    'not-an-email',
    'two@@example.test',
    'a@b',
    'spaces in@example.test',
    'first@example.test second@example.test',
  ])('rejects malformed email %j', async (email) => {
    const before = server.sentMail().length;
    const res = await postContact({ ...validInquiry, email }, asClient());
    expect(res.status).toBe(400);
    expect(server.sentMail().length).toBe(before);
  });

  // Finding F-06: the regex accepts commas, so Reply-To can become an address list.
  it.each(['victim@example.test,attacker@example.test', 'a,attacker@example.test', '"x"@example.test'])(
    'does not let the email field produce more than one Reply-To address (%j)',
    async (email) => {
      const before = server.sentMail().length;
      const res = await postContact({ ...validInquiry, email }, asClient());
      if (res.status === 200) {
        const [mail] = server.sentMail().slice(before);
        expect(String(mail.replyTo)).not.toContain(',');
      } else {
        expect(res.status).toBe(400);
      }
    },
  );

  it('accepts a filled honeypot with a success reply but sends nothing', async () => {
    const before = server.sentMail().length;
    const res = await postContact({ ...validInquiry, website: 'http://spam.example' }, asClient());
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ success: true });
    expect(server.sentMail().length).toBe(before);
  });

  it('truncates over-long fields to their caps', async () => {
    const before = server.sentMail().length;
    await postContact({ ...validInquiry, subject: 'S'.repeat(500), message: 'M'.repeat(6000) }, asClient());
    const [mail] = server.sentMail().slice(before);
    expect(mail.subject.length).toBeLessThanOrEqual('[Hero Keg Inquiry] '.length + 200);
    expect(mail.text).not.toContain('M'.repeat(5001));
  });

  it('rejects bodies over the 20 kB limit without sending mail', async () => {
    const before = server.sentMail().length;
    const res = await postContact({ ...validInquiry, message: 'x'.repeat(25_000) }, asClient());
    expect(res.status).toBe(413);
    expect(server.sentMail().length).toBe(before);
  });

  // Finding F-05: submitter PII is logged on every submission.
  it('does not write submitter email or phone to the logs when delivery succeeds', async () => {
    const email = 'pii-check@example.test';
    const phone = '+251 911 222 333';
    await postContact({ ...validInquiry, email, phone }, asClient());
    await new Promise((r) => setTimeout(r, 100));
    expect(server.logs()).not.toContain(email);
    expect(server.logs()).not.toContain(phone);
  });
});

describe('POST /api/contact — rate limiting', () => {
  let server: TestServer;
  beforeAll(async () => {
    server = await startServer();
  });
  afterAll(() => server.stop());

  it('allows 5 submissions per client per window, then returns 429 and sends nothing', async () => {
    const client = { 'X-Forwarded-For': '198.51.100.7' };
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) {
      statuses.push((await postContact(validInquiry, client)).status);
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429, 429]);
    expect(server.sentMail()).toHaveLength(5);
  });

  it('cannot be bypassed by prepending fake addresses to X-Forwarded-For', async () => {
    // A client may send its own X-Forwarded-For; the trusted proxy appends the
    // real address last. Only that last entry may count.
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) {
      const res = await postContact(validInquiry, { 'X-Forwarded-For': `10.9.9.${i}, 198.51.100.8` });
      statuses.push(res.status);
    }
    expect(statuses.slice(5)).toEqual([429, 429]);
  });
});

describe('POST /api/contact — failure handling', () => {
  it('returns 503 and never reports success when SMTP is not configured', async () => {
    const server = await startServer({ smtpConfigured: false });
    try {
      const res = await postContact(validInquiry);
      expect(res.status).toBe(503);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toMatch(/\+251 943 739 086/);
    } finally {
      await server.stop();
    }
  });

  it('returns a generic 500 that leaks no SMTP or credential details when sending fails', async () => {
    const server = await startServer({ smtpFails: true });
    try {
      const res = await postContact(validInquiry);
      expect(res.status).toBe(500);
      const raw = await res.text();
      expect(JSON.parse(raw).success).toBe(false);
      expect(raw).not.toMatch(/535|Username|Password|smtp-internal-detail|sender@example\.test|synthetic-test-password|at .*\.cjs/i);
    } finally {
      await server.stop();
    }
  });
});
