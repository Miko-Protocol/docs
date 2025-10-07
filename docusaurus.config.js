
// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are no downsides to using JSDoc annotations.
// Learn more at https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MIKO Protocol',
  tagline: "Solana's First AI-Driven Dynamic Reward Token", // <-- Updated Tagline
  favicon: 'img/logo_2.png',

  // Set the production url of your site here
  url: 'https://docs.mikoprotocol.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'Miko-Protocol', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
	  routeBasePath:'/docs',
          // Please change this to your repo.
        },
        blog: false, // Disabled blog functionality
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/miko-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'MIKO Protocol',
        logo: {
          alt: 'MIKO Logo',
          src: 'img/logo_2.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Whitepaper',
          },
          {
            href: 'https://mikoprotocol.com',
            label: 'Website',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Whitepaper',
                to: '/docs/introduction',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'X (Twitter)',
                href: 'https://twitter.com/project_miko',
              },
              {
                label: 'Telegram',
                href: 'https://t.me/mikoprotocol',
              },
	      {
		label: "Miko's Cicle",
		href: 'https://circle.mikoprotocol.com',
	      },
            ],
          },
          {
            title: 'More',
            items: [
	      {
		label: 'HuggingFace',
		href: 'https://huggingface.co/projectmiko/miko-x-multibase-lora-ensemble',
	      },
              {
                label: 'Youtube',
                href: 'https://www.youtube.com/@miko-sound-stage',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} MIKO Protocol.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      mermaid: {
	options: {
	  flowchart: {
	    padding: 8,
	    wrappingWidth: 140
	  },
	},
      },
    }),
};

export default config;
