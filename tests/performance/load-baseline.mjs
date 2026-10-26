// Small closed-loop load test for the static/SPA routes (no dependencies, Node 18+).
//
//   BASE_URL=http://127.0.0.1:3000 node tests/performance/load-baseline.mjs
//
// It refuses to target anything but localhost unless ALLOW_REMOTE=1 is set,
// and must never be pointed at production without an approved test plan.
// POST /api/contact is deliberately excluded: every request would send an email.

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) throw new Error('Set BASE_URL to an authorized test environment.');
const host = new URL(BASE_URL).hostname;
if (!['127.0.0.1', 'localhost', '::1'].includes(host) && process.env.ALLOW_REMOTE !== '1') {
  throw new Error(`Refusing to load-test ${host}. Set ALLOW_REMOTE=1 only for an approved staging target.`);
}

const STAGES = (process.env.STAGES || '1,5,10').split(',').map(Number);
const DURATION_MS = Number(process.env.DURATION_S || 10) * 1000;
const PATHS = (process.env.PATHS || '/,/contact,/robots.txt').split(',');
const TIMEOUT_MS = 5000;

function percentile(sorted, p) {
  if (!sorted.length) return NaN;
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
}

async function runStage(vus) {
  const latencies = [];
  let errors = 0;
  let timeouts = 0;
  const end = Date.now() + DURATION_MS;
  let i = 0;

  async function worker() {
    while (Date.now() < end) {
      const url = BASE_URL + PATHS[i++ % PATHS.length];
      const start = performance.now();
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
        await res.arrayBuffer();
        if (!res.ok) errors++;
      } catch (err) {
        if (err.name === 'TimeoutError') timeouts++;
        errors++;
      }
      latencies.push(performance.now() - start);
    }
  }

  await Promise.all(Array.from({ length: vus }, worker));
  latencies.sort((a, b) => a - b);
  const n = latencies.length;
  return {
    vus,
    requests: n,
    rps: +(n / (DURATION_MS / 1000)).toFixed(1),
    p50_ms: +percentile(latencies, 50).toFixed(2),
    p95_ms: +percentile(latencies, 95).toFixed(2),
    p99_ms: n >= 1000 ? +percentile(latencies, 99).toFixed(2) : 'n<1000',
    error_rate: +(errors / n).toFixed(4),
    timeouts,
  };
}

const results = [];
for (const vus of STAGES) {
  results.push(await runStage(vus));
}
console.table(results);
