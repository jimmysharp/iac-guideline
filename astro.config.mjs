import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'IaC Guideline',
      locales: {
        root: {
          label: '日本語',
          lang: 'ja',
        },
      },
      sidebar: [
        {
          label: 'はじめに',
          autogenerate: { directory: 'introduction' },
        },
        {
          label: 'Terraform',
          autogenerate: { directory: 'terraform' },
        },
        {
          label: 'CDK for AWS',
          items: [
            {
              label: 'はじめに',
              autogenerate: { directory: 'cdk/introduction' },
            },
          ],
        },
      ],
    }),
  ],
  server: {
    host: '0.0.0.0',
  },
  site: 'https://jimmysharp.github.io',
  base: '/iac-guideline/',
});
