import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        'src/renderers/proof_of_concept.ts',
        'src/renderers/generate_examples.ts',
      ],
    },
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
});
