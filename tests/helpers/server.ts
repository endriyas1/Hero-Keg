import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// The server hardcodes port 3000, so only one test server can run at a time.
// vitest.config.ts disables file parallelism for this reason.
export const BASE_URL = 'http://127.0.0.1:3000';

const ROOT = path.resolve(__dirname, '../..');
const SERVER = path.join(ROOT, 'dist/server.cjs');
const MOCK = path.join(__dirname, 'mock-nodemailer.cjs');

export type SentMail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
  [key: string]: unknown;
};

export type TestServer = {
  sentMail(): SentMail[];
  logs(): string;
  stop(): Promise<void>;
};

export type ServerOptions = {
  smtpConfigured?: boolean;
  smtpFails?: boolean;
};

export const RECIPIENT = 'inbox@example.test';

export async function startServer(options: ServerOptions = {}): Promise<TestServer> {
  const { smtpConfigured = true, smtpFails = false } = options;

  if (!fs.existsSync(SERVER)) {
    throw new Error('dist/server.cjs is missing. Run `npm run build` first.');
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'herokeg-test-'));
  const captureFile = path.join(dir, 'mail.jsonl');
  let output = '';

  // Start from a clean environment so real credentials in the shell are never used.
  const env: NodeJS.ProcessEnv = {
    PATH: process.env.PATH,
    NODE_ENV: 'production',
    MAIL_CAPTURE_FILE: captureFile,
    MAIL_FAIL: smtpFails ? '1' : '0',
  };
  if (smtpConfigured) {
    env.GMAIL_USER = 'sender@example.test';
    env.GMAIL_APP_PASSWORD = 'synthetic-test-password';
    env.CONTACT_RECIPIENT_EMAIL = RECIPIENT;
  }

  const child: ChildProcess = spawn(process.execPath, ['--require', MOCK, SERVER], {
    cwd: ROOT,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout!.on('data', (chunk) => (output += chunk));
  child.stderr!.on('data', (chunk) => (output += chunk));

  const deadline = Date.now() + 10_000;
  while (true) {
    if (child.exitCode !== null) {
      throw new Error(`Test server exited early:\n${output}`);
    }
    try {
      const res = await fetch(`${BASE_URL}/robots.txt`);
      if (res.ok) break;
    } catch {
      // not listening yet
    }
    if (Date.now() > deadline) {
      child.kill();
      throw new Error(`Test server did not start:\n${output}`);
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  return {
    sentMail() {
      if (!fs.existsSync(captureFile)) return [];
      return fs
        .readFileSync(captureFile, 'utf8')
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line));
    },
    logs: () => output,
    stop() {
      return new Promise((resolve) => {
        if (child.exitCode !== null) return resolve();
        child.once('exit', () => {
          fs.rmSync(dir, { recursive: true, force: true });
          resolve();
        });
        child.kill();
      });
    },
  };
}

export const validInquiry = {
  name: 'Test Person',
  company: 'Synthetic Brewery Ltd',
  email: 'test.person@example.test',
  phone: '+251 900 000 000',
  service: 'Keg Sanitation & Cleaning',
  kegs: '40',
  subject: 'Quote request',
  message: 'Synthetic test message.',
};

export function postContact(body: unknown, headers: Record<string, string> = {}) {
  return fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
