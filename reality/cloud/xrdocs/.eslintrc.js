module.exports = {
  'settings': {
    'import/resolver': {
      'node': {
        'extensions': [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
        ],
      },
      'alias': {
        'map': [
          ['@docusaurus', `${__dirname}/node_modules/@docusaurus/core/lib/client/exports/`],
          ['@theme', `${__dirname}/node_modules/@docusaurus/theme-classic/src/theme/`],
          ['@theme-original', `${__dirname}/node_modules/@docusaurus/theme-classic/src/theme/`],
        ],
      },
    },
  },
}
