module.exports = {
  overrides: [
    {
      files: ['**/*.ts', '**/*.js'],
      rules: {
        'import/no-unresolved': [
          'error',
          {
            ignore: ['@8thwall/ecs'],
          },
        ],
      },
    },
  ],
}
