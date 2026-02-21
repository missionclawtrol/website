// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      // Disable the default base styles to avoid conflicts with Starlight
      applyBaseStyles: false,
    }),
    starlight({
      title: 'Mission Clawtrol',
      description: 'AI agent orchestration dashboard — 9 specialized agents, one dashboard.',
      defaultLocale: 'en',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/missionclawtrol/mission-clawtrol',
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'docs' },
            { label: 'Setup Guide', slug: 'docs/guides/setup' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Agent Roster', slug: 'docs/guides/agents' },
            { label: 'Task Management', slug: 'docs/guides/tasks' },
            { label: 'Projects', slug: 'docs/guides/projects' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'API Reference', slug: 'docs/reference/api' },
          ],
        },
      ],
      customCss: ['./src/styles/global.css'],
    }),
  ],
});
