import { defineConfig } from 'vitest/config';
import stencil from 'unplugin-stencil/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [stencil(), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    environmentMatchGlobs: [['**/*.a11y.spec.ts', 'jsdom']],
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
  },
});
