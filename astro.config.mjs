import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Terraform Guideline',
      sidebar: [
        {
          label: 'はじめに',
          autogenerate: { directory: 'introduction' },
        },
        {
          label: 'Terraform',
          items: [
            {
              label: 'はじめに',
              autogenerate: { directory: 'terraform/introduction' },
            },
          ],
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
});
