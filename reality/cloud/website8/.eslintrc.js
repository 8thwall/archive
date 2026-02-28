/* eslint-env es6 */
const spacingRules = {
  'brace-style': 'error',
  'comma-spacing': 'error',
  'eol-last': 'error',
  'indent': ['error', 2, {
    SwitchCase: 1,
    // Copied from https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js#L146
    ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
  }],
  'keyword-spacing': 'error',
  'max-len': ['error', {'code': 100}],
  'object-curly-newline': ['error', {'multiline': true, 'consistent': true}],
  'object-curly-spacing': ['error', 'never'],
  'object-property-newline': ['error', {'allowAllPropertiesOnSameLine': true}],
  'one-var-declaration-per-line': ['error', 'initializations'],
  'operator-linebreak': ['error', 'after', {'overrides': {'?': 'before', ':': 'before'}}],
  'react/jsx-indent': ['error', 2, {indentLogicalExpressions: true, checkAttributes: true}],
  'react/jsx-one-expression-per-line': 'off',
  'react/jsx-wrap-multilines': ['error', {
    'declaration': 'parens-new-line',
    'assignment': 'parens-new-line',
    'return': 'parens-new-line',
    'arrow': 'parens-new-line',
    'condition': 'ignore',
    'logical': 'ignore',
    'prop': 'parens-new-line',
  }],
  'space-before-blocks': 'error',
}

const syntaxRules = {
  'arrow-body-style': ['error', 'as-needed'],
  'comma-dangle': ['error', {
    'arrays': 'always-multiline',
    'objects': 'always-multiline',
    'imports': 'always-multiline',
    'exports': 'always-multiline',
    'functions': 'never',
  }],
  'implicit-arrow-linebreak': 'error',
  'jsx-quotes': ['error', 'prefer-single'],
  'no-else-return': ['off'],
  'no-underscore-dangle': 'off', // For _c8
  'quotes': ['error', 'single'],
  'semi': ['error', 'never'],
  'quote-props': ['error', 'consistent'],
}

const semanticsRules = {
  'no-param-reassign': ['error', {props: false}],
  'no-plusplus': 'off',
  'no-var': 'error',
  'one-var': 'off',
  'react/destructuring-assignment': 'off',
  'react/prop-types': 'off',
  'react/function-component-definition': [
    'error',
    {
      'namedComponents': 'arrow-function',
      'unnamedComponents': 'arrow-function',
    },
  ],
}

const projectRules = {
  'import/no-extraneous-dependencies': 'off',
  'import/no-duplicates': 'off', // https://github.com/benmosher/eslint-plugin-import/issues/1403
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'error',
  'react/jsx-filename-extension': ['error', {'extensions': ['.tsx', '.jsx']}],
  'import/extensions': ['error', 'ignorePackages', {
    'ts': 'never',
    'tsx': 'never',
    'js': 'never',
    'jsx': 'never',
  }],
  'import/order': ['error', {
    'groups': [
      ['builtin', 'external'],
    ],
    'newlines-between': 'always-and-inside-groups',
  }],
}

const domRules = {
  'jsx-a11y/label-has-for': ['off'], // Deprecated
  'jsx-a11y/label-has-associated-control': ['error', {
    'controlComponents': ['PrimaryRadioButton'],
    'assert': 'both',
    'depth': 25,
  }],
}

module.exports = {
  'env': {
    browser: true,
    es6: true,
    node: true,
  },
  'globals': {
    'Build8': 'readonly',
    'BuildIf': 'readonly',
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/typescript',
    'airbnb',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
    'warnOnUnsupportedTypeScriptVersion': false,
  },
  'plugins': ['react', '@typescript-eslint'],
  'rules': {
    ...spacingRules,
    ...syntaxRules,
    ...semanticsRules,
    ...projectRules,
    ...domRules,
  },
  'settings': {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    'react': {
      version: 'detect',
    },
  },
}
