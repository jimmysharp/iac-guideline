/** @type {import("prettier").Config} */
const config = {
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  endOfLine: 'lf',
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};

export default config;
