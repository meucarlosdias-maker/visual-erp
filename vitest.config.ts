import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/utils/**/*.ts',
        'src/lib/**/*.ts',
        'src/config/permissions.ts',
        'src/constants/permissions.ts',
        'src/constants/formats.ts',
        'src/hooks/use-debounce.ts',
        'src/hooks/use-confirm.tsx',
        'src/app/api/health/route.ts',
        'src/app/api/health/**',
      ],
      exclude: [
        'src/generated/**',
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/index.ts',
        'src/lib/documentation/**',
      ],
      thresholds: {
        lines: 75,
        functions: 65,
        branches: 60,
        statements: 75,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
