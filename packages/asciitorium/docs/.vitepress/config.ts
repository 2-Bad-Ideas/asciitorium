import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'asciitorium',
  description: 'ASCII-based UI framework for web and CLI',
  base: '/asciitorium/', // GitHub Pages: https://tgruby.github.io/asciitorium/

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/api/README' },
      { text: 'GitHub', link: 'https://github.com/tgruby/asciitorium' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Core Concepts', link: '/guide/core-concepts' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'Overview',
          items: [
            { text: 'API Index', link: '/api/README' }
          ]
        },
        {
          text: 'Core',
          items: [
            { text: 'App', link: '/api/core/App/README' },
            { text: 'Component', link: '/api/core/Component/README' },
            { text: 'State', link: '/api/core/State/README' }
          ]
        },
        {
          text: 'Components',
          items: [
            { text: 'Button', link: '/api/components/Button/README' }
          ]
        },
        {
          text: 'Types',
          items: [
            { text: 'Type Definitions', link: '/api/types/README' }
          ]
        }
      ]
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tgruby/asciitorium' }
    ]
  }
});
