// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('./src/themes/8theme-light')
const darkCodeTheme = require('./src/themes/8theme-dark')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '8th Wall',
  tagline: '8th Wall Documentation',
  favicon: 'images/favicon.ico',

  // Set the production url of your site here
  url: 'https://8thwall.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docs/',
  trailingSlash: true,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja', 'fr', 'de', 'es'],
  },

  markdown: {
    format: 'detect',
    mermaid: true,
  },

  themes: [
    '@docusaurus/theme-mermaid',
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          path: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          exclude: ['**/legacy/**'],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
        googleTagManager: {
          containerId: 'GTM-WHW972G',
        },
        gtag: {
          trackingID: 'UA-92821837-1',
          anonymizeIP: true,
        },
        sitemap: {
          ignorePatterns: [
            '/legacy/**',
            '/legacy',
            '**/legacy/**',
          ],
        },
      }),
    ],
  ],

  plugins: [
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'account',
        path: 'account',
        routeBasePath: '/account',
        sidebarPath: './sidebarsAccount.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'studio',
        path: 'studio',
        routeBasePath: '/studio',
        sidebarPath: './sidebarsStudio.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'api',
        routeBasePath: '/api',
        sidebarPath: './sidebarsApi.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'legacy',
        path: 'legacy',
        routeBasePath: '/legacy',
        sidebarPath: './sidebarsLegacy.js',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'migration',
        path: 'migration',
        routeBasePath: '/migration',
        sidebarPath: './sidebarsQuickstart.js',
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // Account
          {
            from: '/account/settings/manage-subscriptions/',
            to: '/account/settings/manage-credits',
          },
          {
            from: '/account/settings/billing-information/',
            to: '/account/settings/manage-billing',
          },
          {
            from: '/account/settings/manage-payment-methods/',
            to: '/account/settings/manage-billing',
          },
          {
            from: '/studio/essentials/entities-and-components/',
            to: '/studio/essentials/overview/',
          },
          {
            from: '/studio/essentials/entities-and-components/entities/',
            to: '/studio/essentials/overview/',
          },
          {
            from: '/studio/essentials/entities-and-components/components/',
            to: '/studio/essentials/overview/',
          },
          {
            from: '/studio/essentials/world/',
            to: '/studio/essentials/overview/',
          },
          {
            from: '/studio/essentials/spaces/',
            to: '/studio/essentials/overview/',
          },
          // Key Concepts
          {
            from: '/studio/home/key-concepts',
            to: '/studio/essentials/overview',
          },
          // Guide: Components
          {
            from: '/studio/guides/components',
            to: '/studio/essentials/overview',
          },
          // Guide: Custom Components
          {
            from: '/studio/guides/components/create-component',
            to: '/studio/essentials/custom-components',
          },
          {
            from: '/studio/guides/custom-components/',
            to: '/studio/essentials/custom-components/',
          },
          // Guide: Component Schema
          {
            from: '/studio/guides/components/component-schema',
            to: '/studio/essentials/schema',
          },
          // Guide: Lifecycle Methods
          {
            from: '/studio/guides/components/lifecycle-methods',
            to: '/studio/essentials/component-lifecycle',
          },
          // Guide: Common Issues and Best Practices
          {
            from: '/studio/guides/components/common-issues-and-best-practices',
            to: '/studio/essentials/best-practices',
          },
          // Guide: Custom Editor Fields
          {
            from: '/studio/guides/components/custom-editor-fields',
            to: '/studio/essentials/schema#custom-editor-fields',
          },
          // Guide: Custom Component Examples
          {
            from: '/studio/guides/components/examples',
            to: '/studio/essentials/custom-components',
          },
          // Guide: Entity Manipulation
          {
            from: '/studio/guides/entity-manipulation',
            to: '/studio/guides/entities',
          },
          // Guide: Gaussian Splats
          {
            from: '/studio/guides/gaussian-splats',
            to: '/studio/guides/splats',
          },
          // Guide: State-Machines
          {
            from: '/studio/guides/state-machine',
            to: '/studio/essentials/state-machines',
          },
          // Guide: UI
          {
            from: '/studio/guides/user-interface',
            to: '/studio/guides/ui',
          },
          // Guide: Models
          {
            from: '/studio/guides/3d-models',
            to: '/studio/guides/models',
          },
          // Guide: Native App Export
          {
            from: '/studio/guides/native-app-export/',
            to: '/studio/native-app-export/',
          },
          {
            from: '/studio/essentials/behaviors/',
            to: '/studio/guides/global-behaviors/',
          },
          // API: Animations
          {
            from: '/api/studio/ecs/CustomPropertyAnimation',
            to: '/api/studio/ecs/animation/custom-property-animation',
          },
          {
            from: '/api/studio/ecs/CustomVec3Animation',
            to: '/api/studio/ecs/animation/custom-vec3-animation',
          },
          {
            from: '/studio/changelog',
            to: '/studio/release-notes',
          },
          {
            from: '/api/studio/ecs/FollowAnimation',
            to: '/api/studio/ecs/animation/follow-animation',
          },
          {
            from: '/api/studio/ecs/LookAtAnimation',
            to: '/api/studio/ecs/animation/look-at-animation',
          },
          {
            from: '/api/studio/ecs/PositionAnimation',
            to: '/api/studio/ecs/animation/position-animation',
          },
          {
            from: '/api/studio/ecs/RotateAnimation',
            to: '/api/studio/ecs/animation/rotate-animation',
          },
          {
            from: '/api/studio/ecs/ScaleAnimation',
            to: '/api/studio/ecs/animation/scale-animation',
          },
          // API: Geometry
          {
            from: '/api/studio/ecs/BoxGeometry',
            to: '/api/studio/ecs/geometry/box-geometry',
          },
          {
            from: '/api/studio/ecs/CapsuleGeometry',
            to: '/api/studio/ecs/geometry/capsule-geometry',
          },
          {
            from: '/api/studio/ecs/CircleGeometry',
            to: '/api/studio/ecs/geometry/circle-geometry',
          },
          {
            from: '/api/studio/ecs/ConeGeometry',
            to: '/api/studio/ecs/geometry/cone-geometry',
          },
          {
            from: '/api/studio/ecs/CylinderGeometry',
            to: '/api/studio/ecs/geometry/cylinder-geometry',
          },
          {
            from: '/api/studio/ecs/PlaneGeometry',
            to: '/api/studio/ecs/geometry/plane-geometry',
          },
          {
            from: '/api/studio/ecs/TetrahedronGeometry',
            to: '/api/studio/ecs/geometry/polyhedron-geometry',
          },
          {
            from: '/api/studio/ecs/RingGeometry',
            to: '/api/studio/ecs/geometry/ring-geometry',
          },
          {
            from: '/api/studio/ecs/SphereGeometry',
            to: '/api/studio/ecs/geometry/sphere-geometry',
          },
          // API
          {
            from: '/api/studio/ecs/GltfModel',
            to: '/api/studio/ecs/gltf-model',
          },
          {
            from: '/api/studio/ecs/ParticleEmitter',
            to: '/api/studio/ecs/particle-emitter',
          },
          {
            from: '/api/studio/ecs/ShadowMaterial',
            to: '/api/studio/ecs/material/shadow-material',
          },
          // API: ECS
          {
            from: '/api/studio/ecs/createStateMachine',
            to: '/api/studio/ecs',
          },
          {
            from: '/api/studio/ecs/defineQuery',
            to: '/api/studio/ecs',
          },
          {
            from: '/api/studio/ecs/defineState',
            to: '/api/studio/ecs',
          },
          {
            from: '/api/studio/ecs/defineSystem',
            to: '/api/studio/ecs',
          },
          {
            from: '/api/studio/ecs/deleteStateMachine',
            to: '/api/studio/ecs',
          },
          {
            from: '/api/studio/ecs/getAttribute',
            to: '/api/studio/ecs',
          },
          {
            from: '/api/studio/ecs/getBehaviors',
            to: '/api/studio/ecs',
          },
          {
            from: '/api/studio/ecs/listAttributes',
            to: '/api/studio/ecs',
          },
          {
            from: '/api/studio/ecs/registerBehavior',
            to: '/api/studio/ecs',
          },
          {
            from: '/api/studio/ecs/registerComponent',
            to: '/api/studio/ecs',
          },
          {
            from: '/api/studio/ecs/unregisterBehavior',
            to: '/api/studio/ecs',
          },
          {
            from: '/api/studio/ecs/videocontrols',
            to: '/api/studio/ecs/video-controls',
          },
          // Events
          {
            to: '/api/studio/events/camera',
            from: [
              '/api/studio/ecs/CameraEvents',
              '/api/studio/ecs/CameraEvents/ACTIVE_CAMERA_CHANGE',
              '/api/studio/ecs/CameraEvents/ACTIVE_CAMERA_EID_CHANGE',
              '/api/studio/ecs/CameraEvents/XR_CAMERA_EDIT',
            ],
          },
          {
            to: '/api/studio/events/general',
            from: [
              '/api/studio/ecs/events/SPLAT_MODEL_LOADED',
              '/api/studio/ecs/events/GLTF_ANIMATION_FINISHED',
              '/api/studio/ecs/events/GLTF_ANIMATION_LOOP',
              '/api/studio/ecs/events/GLTF_MODEL_LOADED',
            ],
          },
        ],
        createRedirects(existingPath) {
          if (existingPath.startsWith('/api/studio/')) {
            return existingPath.replace('/api/studio/', '/studio/api/')
          }
          return undefined
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'https://cdn.8thwall.com/web/share/8th_Wall_Metadata_SocialCover-mbn6660v.png',
      navbar: {
        logo: {
          alt: '8th Wall',
          href: 'https://8thwall.com',
          target: '_self',
          src: 'images/branding/8th-Wall-Logo-Purple.svg',
          srcDark: 'images/branding/8th-Wall-Logo-White.svg',
        },
        items: [
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            type: 'dropdown',
            label: 'Support',
            position: 'right',
            items: [
              {
                label: 'Project Library',
                // TODO (tri) figure out a way to make these origin aware
                href: 'https://8thwall.com/projects',
                target: '_self',
              },
              {
                label: 'Tutorials',
                href: 'https://8thwall.com/tutorials',
                target: '_self',
              },
              {
                label: 'Courses',
                href: 'https://www.8thwall.com/courses',
                target: '_self',
              },
              {
                label: 'Forum',
                href: 'https://forum.8thwall.com/',
                target: '_self',
              },
            ],
          },
        ],
      },
      prism: {
        defaultLanguage: 'typescript',
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: '<REMOVED_BEFORE_OPEN_SOURCING>',

        // Public API key: it is safe to commit it
        apiKey: '<REMOVED_BEFORE_OPEN_SOURCING>',

        indexName: '8thwall-docs-prod',

        contextualSearch: true,

        // Optional: Algolia search parameters
        searchParameters: {
          facetFilters: [
            [
              'docusaurus_tag:docs-default-current',
              'docusaurus_tag:docs-studio-current',
              'docusaurus_tag:docs-api-current',
              'docusaurus_tag:docs-quickstart-current',
              'docusaurus_tag:docs-account-current',
            ],
          ],
        },

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
      },
      mermaid: {
        theme: {
          light: 'base',
          dark: 'dark',
        },
        options: {
          themeVariables: {
            fontFamily: '"Nunito", sans-serif',
            primaryColor: '#7611b6',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#ad50ff',
            lineColor: '#9919ea',
            secondaryColor: '#ad50ff',
            tertiaryColor: '#2d2e43',
          },
        },
      },
    }),
}

module.exports = config
