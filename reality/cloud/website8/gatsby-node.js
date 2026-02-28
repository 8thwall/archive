const GatsbyStaticSitePlugin = require('./gatsby-static-site-plugin')

exports.onCreateWebpackConfig = ({actions}) => {
  // add webpack plugin to gatsby's webpack config
  actions.setWebpackConfig({
    plugins: [new GatsbyStaticSitePlugin()],
  })
}

/**
 * Workaround for missing sitePage.context:
 * Used for generating sitemap with `gatsby-plugin-react-i18next`
 * and `gatsby-plugin-sitemap` plugins
 */
exports.createSchemaCustomization = ({actions}) => {
  const {createTypes} = actions
  createTypes(`
  type SitePage implements Node {
    context: SitePageContext
  }
  type SitePageContext {
    i18n: i18nContext
  }
  type i18nContext {
    language: String,
    languages: [String],
    defaultLanguage: String,
    originalPath: String
    routed: Boolean
  }
`)
}
