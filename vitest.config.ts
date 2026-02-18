import { defineConfig } from 'vitest/config';
import stencil from 'unplugin-stencil/vite';

export default defineConfig({
  plugins: [stencil()],
  test: {
    environment: 'happy-dom',
    environmentMatchGlobs: [['**/*.a11y.spec.ts', 'jsdom']],
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
  },
});
