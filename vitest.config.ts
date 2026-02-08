import { defineConfig } from 'vitest/config';
import stencil from 'unplugin-stencil/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [stencil(), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
  },
});
