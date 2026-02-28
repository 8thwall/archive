/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
const {DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES} = require('./locales')

const siteUrl = 'https://www.8thwall.com'

module.exports = {
  siteMetadata: {
    siteUrl,
  },
  assetPrefix: '/static/web',
  trailingSlash: 'never',
  plugins: [
    'gatsby-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-typescript',
    'gatsby-plugin-emotion',
    'gatsby-plugin-jss',
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    process.env.NODE_ENV === 'development' && {
      resolve: 'gatsby-plugin-page-creator',
      options: {
        path: `${__dirname}/src/dev-pages`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'docs-data',
        path: `${__dirname}/src/docs/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'locale',
        path: `${__dirname}/src/i18n`,
      },
    },
    'gatsby-transformer-remark',
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage(filter: {context: {i18n: {routed: {eq: false}}}}) {
            nodes {
              path
            }
          }
        }`,
        resolvePages: ({site, allSitePage}) => {
          const discoveryKeywords = ['', '/arts-culture', '/automotive', '/beauty-wellness',
            '/beer-wine-spirits', '/business', '/cpg-fmcg', '/education', '/entertainment',
            '/fashion', '/film-television', '/finance', '/food-beverage', '/games-toys',
            '/home-garden', '/music', '/sports']
          const discoveryPages = discoveryKeywords.map((keyword) => `/discover${keyword}`)
          const solutionsKeywords = ['', '/retail', '/cpg', '/fashion', '/entertainment', '/qsr']
          const solutionsPages = solutionsKeywords.map((keyword) => `/solutions${keyword}`)
          const productsKeywords = ['', '/niantic-studio', '/world-ar', '/location-ar',
            '/image-targets', '/human-ar', '/headsets', '/cloud-editor']
          const productsPages = productsKeywords.map((keyword) => `/products${keyword}`)
          const cmsPages = [
            ...solutionsPages,
            ...productsPages,
            '/courses',
            '/community',
            '/case-studies',
            '/contact-us-games',
            '/tutorials',
          ]
          const externalPages = [
            '/projects',
            '/modules',
            '/blog',
            '/docs',
            '/forum',
            '/partners',
            '/get-started',
            '/login',
            ...discoveryPages,
            ...cmsPages,
          ]
          const disallowedPages = ['/open-source-licenses', '/thankyou', '/404', '/404.html']
          const pages = allSitePage.nodes
            .filter((node) => !disallowedPages.includes(node.path))
            .map((node) => ({
              path: `${site.siteMetadata.siteUrl}${node.path}`,
            }))

          externalPages.forEach((page) => {
            pages.push({
              path: `${site.siteMetadata.siteUrl}${page}`,
            })
          })
          return pages
        },
        serialize: ({path}) => ({url: path}),
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{userAgent: '*', allow: '/', disallow: ['/open-source-licenses', '/thankyou']}],
        sitemap: `${siteUrl}/sitemap-index.xml`,
        host: undefined,
      },
    },
    {
      resolve: 'gatsby-plugin-webfonts',
      options: {
        fonts: {
          google: [
            {
              family: 'Nunito',
              variants: ['400', '600', '700'],
            },
            {
              family: 'Share Tech Mono',
              variants: ['400'],
            },
            {
              family: 'Noto Sans JP',
              variants: ['300', '400', '500', '600', '700', '900'],
            },
          ],
        },
      },
    },
    {
      resolve: 'gatsby-plugin-react-i18next',
      options: {
        localeJsonSourceName: 'locale',
        languages: SUPPORTED_LANGUAGES,
        defaultLanguage: DEFAULT_LANGUAGE,
        redirect: false,
        siteUrl,
        i18nextOptions: {
          fallbackLng: DEFAULT_LANGUAGE,
          supportedLngs: SUPPORTED_LANGUAGES,
          ns: [],
          interpolation: {
            escapeValue: false,
          },
        },
      },
    },
  ].filter(Boolean),
}
