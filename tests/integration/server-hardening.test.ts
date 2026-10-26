import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { BASE_URL, startServer, type TestServer } from '../helpers/server';

describe('production server hardening', () => {
  let server: TestServer;
  beforeAll(async () => {
    server = await startServer();
  });
  afterAll(() => server.stop());

  // Finding F-01: the server bundle and its sourcemap are built into the public dir.
  it.each(['/server.cjs', '/server.cjs.map'])('does not serve the backend bundle at %s', async (p) => {
    const res = await fetch(BASE_URL + p);
    const body = await res.text();
    expect(body).not.toContain('GMAIL_APP_PASSWORD');
    expect(body).not.toContain('nodemailer');
  });

  it.each(['/.env', '/.env.example', '/package.json', '/server.ts', '/src/App.tsx', '/.git/config'])(
    'does not expose repository file %s',
    async (p) => {
      const body = await (await fetch(BASE_URL + p)).text();
      expect(body).not.toMatch(/GMAIL_|"dependencies"|from 'express'|import React|\[core\]/);
    },
  );

  it('serves the built SPA, not the Vite dev client', async () => {
    const html = await (await fetch(BASE_URL + '/')).text();
    expect(html).not.toContain('/@vite/client');
    expect(html).toMatch(/<script type="module" crossorigin src="\/assets\/index-[\w-]+\.js">/);
  });

  // Finding F-03: no security headers.
  describe('security headers on HTML responses', () => {
    let headers: Headers;
    beforeAll(async () => {
      headers = (await fetch(BASE_URL + '/contact')).headers;
    });

    it('does not advertise the framework', () => {
      expect(headers.get('x-powered-by')).toBeNull();
    });

    it('sets X-Content-Type-Options: nosniff', () => {
      expect(headers.get('x-content-type-options')).toBe('nosniff');
    });

    it('forbids framing (clickjacking)', () => {
      const csp = headers.get('content-security-policy') ?? '';
      const xfo = headers.get('x-frame-options') ?? '';
      expect(/frame-ancestors\s+('none'|'self')/.test(csp) || /^(DENY|SAMEORIGIN)$/i.test(xfo)).toBe(true);
    });

    it('sets a Content-Security-Policy restricting scripts to the site itself', () => {
      const csp = headers.get('content-security-policy') ?? '';
      expect(csp).toMatch(/(script-src|default-src)[^;]*'self'/);
      expect(csp).not.toMatch(/script-src[^;]*'unsafe-eval'/);
    });

    it('sets a Referrer-Policy', () => {
      expect(headers.get('referrer-policy')).toBeTruthy();
    });
  });

  // Finding F-08: unknown API routes and wrong methods fall through to the SPA.
  it('returns 404 JSON for unknown API routes instead of the SPA page', async () => {
    const res = await fetch(BASE_URL + '/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toMatch(/application\/json/);
  });

  it('does not answer GET /api/contact with a 200 HTML page', async () => {
    const res = await fetch(BASE_URL + '/api/contact');
    expect(res.status).not.toBe(200);
  });

  it('returns JSON (not an HTML error page) for malformed JSON bodies', async () => {
    const res = await fetch(BASE_URL + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"name": ',
    });
    expect(res.status).toBe(400);
    expect(res.headers.get('content-type')).toMatch(/application\/json/);
    const body = await res.text();
    expect(body).not.toMatch(/SyntaxError|at JSON\.parse|node_modules/);
  });

  it('rejects other methods on /api/contact with 405', async () => {
    const res = await fetch(BASE_URL + '/api/contact');
    expect(res.status).toBe(405);
    expect(res.headers.get('allow')).toBe('POST');
  });

  // Finding F-11: hashed assets were uncompressed and revalidated on every view.
  it('serves hashed assets compressed and cacheable for a year', async () => {
    const html = await (await fetch(BASE_URL + '/')).text();
    const script = html.match(/src="(\/assets\/index-[\w-]+\.js)"/)![1];
    const res = await fetch(BASE_URL + script, { headers: { 'Accept-Encoding': 'gzip' } });
    expect(res.headers.get('content-encoding')).toBe('gzip');
    expect(res.headers.get('cache-control')).toMatch(/max-age=31536000.*immutable/);
  });

  it('keeps index.html revalidated so new deploys are picked up', async () => {
    const res = await fetch(BASE_URL + '/');
    expect(res.headers.get('cache-control')).not.toMatch(/immutable/);
  });

  it('serves robots.txt and sitemap.xml with the right content types', async () => {
    const robots = await fetch(BASE_URL + '/robots.txt');
    expect(robots.headers.get('content-type')).toMatch(/text\/plain/);
    const sitemap = await fetch(BASE_URL + '/sitemap.xml');
    expect(sitemap.headers.get('content-type')).toMatch(/application\/xml/);
  });
});

// Finding F-02: without NODE_ENV the built server used to start the Vite dev server.
describe('built server with NODE_ENV unset', () => {
  let server: TestServer;
  beforeAll(async () => {
    server = await startServer({ nodeEnv: null });
  });
  afterAll(() => server.stop());

  it('still serves the production build and hides the source', async () => {
    const html = await (await fetch(BASE_URL + '/')).text();
    expect(html).not.toContain('/@vite/client');
    const source = await (await fetch(BASE_URL + '/server.ts?raw')).text();
    expect(source).not.toContain("from 'express'");
    expect((await fetch(BASE_URL + '/contact')).headers.get('content-security-policy')).toBeTruthy();
  });
});
