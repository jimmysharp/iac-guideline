import prettier from 'eslint-config-prettier';
import markdown from 'eslint-plugin-markdown';
import * as mdx from 'eslint-plugin-mdx';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // Markdown
  ...markdown.configs.recommended,
  // MDX
  mdx.flat,
  // prettier
  prettier,
  // ignore
  {
    ignores: ['node_modules/', '.pnpm-store/', 'dist/', '.astro/'],
  },
];
