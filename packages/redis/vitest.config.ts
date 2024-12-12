import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html'], // Types of reports to generate
      include: ['src/**/*.ts'], // Files to include for coverage
    },
  },
});
