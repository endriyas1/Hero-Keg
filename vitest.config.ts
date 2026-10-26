import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    // The server under test always binds port 3000, so files must run one at a time.
    fileParallelism: false,
    testTimeout: 15_000,
    hookTimeout: 20_000,
  },
});
