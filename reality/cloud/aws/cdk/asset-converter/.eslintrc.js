const path = require('path')

module.exports = {
  'rules': {
    'no-console': 'off',
  },
  'overrides': [
    {
      'files': ['bin/**', 'lib/**'],
      'rules': {
        'no-new': 'off',
        'camelcase': 'off',
      },
    },
  ],
  'settings': {
    'import/resolver': {
      'typescript': {
        'alwaysTryTypes': true,
        'project': path.join(__dirname, 'tsconfig.json'),
      },
    },
  },
}
