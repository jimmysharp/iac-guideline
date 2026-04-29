import prettier from 'eslint-config-prettier';
import markdown from '@eslint/markdown';
import * as mdx from 'eslint-plugin-mdx';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Markdown
  {
    files: ['**/*.md'],
    plugins: {
      markdown,
    },
    extends: ['markdown/recommended'],
    rules: {
      'markdown/no-missing-label-refs': 'off',
    },
  },
  // MDX
  mdx.flat,
  // prettier
  prettier,
  // ignore
  {
    ignores: ['node_modules/', '.pnpm-store/', 'dist/', '.astro/'],
  },
]);
