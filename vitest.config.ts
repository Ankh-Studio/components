import { defineConfig } from 'vitest/config';
import stencil from 'unplugin-stencil/vite';

export default defineConfig({
  plugins: [stencil()],
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
  },
});
