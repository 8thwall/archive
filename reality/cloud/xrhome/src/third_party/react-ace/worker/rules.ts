import {rules as baseAirbnbRulesBestPractices} from 'eslint-config-airbnb-base/rules/best-practices'
import {rules as baseAirbnbRulesEs6} from 'eslint-config-airbnb-base/rules/es6'
import {rules as baseAirbnbRulesErrors} from 'eslint-config-airbnb-base/rules/errors'
import {rules as baseAirbnbRulesStrict} from 'eslint-config-airbnb-base/rules/strict'
import {rules as baseAirbnbRulesStyle} from 'eslint-config-airbnb-base/rules/style'
import {rules as baseAirbnbRulesVariables} from 'eslint-config-airbnb-base/rules/variables'

const spacingRules = {
  'brace-style': 'warn',
  'comma-spacing': 'warn',
  'eol-last': 'warn',
  'indent': ['warn', 2, {
    SwitchCase: 1,
    // Copied from https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js#L146
    ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
  }],
  'keyword-spacing': 'warn',
  'max-len': ['warn', {'code': 100}],
  'no-trailing-spaces': 'warn',
  'object-curly-newline': ['warn', {'multiline': true, 'consistent': true}],
  'object-curly-spacing': ['warn', 'never'],
  'object-property-newline': ['warn', {'allowAllPropertiesOnSameLine': true}],
  'operator-linebreak': ['warn', 'after', {'overrides': {'?': 'before', ':': 'before'}}],
  'react/jsx-indent': ['warn', 2, {indentLogicalExpressions: true, checkAttributes: true}],
  'react/jsx-one-expression-per-line': 'off',
  'react/jsx-wrap-multilines': ['warn', {
    'declaration': 'parens-new-line',
    'assignment': 'parens-new-line',
    'return': 'parens-new-line',
    'arrow': 'parens-new-line',
    'condition': 'ignore',
    'logical': 'ignore',
    'prop': 'parens-new-line',
  }],
  'space-before-blocks': 'warn',
}

/* eslint-disable max-len */
// From:
//   https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js
const DISALLOWED_SYNTAX = [
  {
    'selector': 'ForInStatement',
    'message': 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
  },
  // NOTE(christoph): We're allowing this one because we're using generators and we can avoid
  // Anonymous functions if we use "for of" loops.
  // {
  //   "selector": "ForOfStatement",
  //   "message": "iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations."
  // },
  {
    'selector': 'LabeledStatement',
    'message': 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
  },
  {
    'selector': 'WithStatement',
    'message': '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
  },
]
/* eslint-enable max-len */

const syntaxRules = {
  'arrow-body-style': ['warn', 'as-needed'],
  'comma-dangle': ['warn', {
    'arrays': 'always-multiline',
    'objects': 'always-multiline',
    'imports': 'always-multiline',
    'exports': 'always-multiline',
    'functions': 'never',
  }],
  'implicit-arrow-linebreak': 'warn',
  'jsx-quotes': ['warn', 'prefer-single'],
  'no-else-return': ['off'],
  'no-underscore-dangle': 'off',  // For _c8
  'quotes': ['warn', 'single'],
  'semi': ['warn', 'never'],
  'semi-style': ['error', 'first'],
  'quote-props': ['warn', 'consistent'],
  'arrow-parens': ['warn', 'as-needed', {requireForBlockBody: true}],
  'max-lines': ['warn', {max: 1000}],
  'max-statements': ['warn', {max: 50}, {ignoreTopLevelFunctions: true}],
  'prefer-destructuring': [
    'warn',
    {
      VariableDeclarator: {array: true, object: true},
      AssignmentExpression: {array: false, object: false},
    },
    {enforceForRenamedProperties: false},
  ],
  'multiline-comment-style': ['warn', 'separate-lines'],
  'local-rules/inline-comment-spacing': 'error',
  'no-multi-spaces': ['warn', {ignoreEOLComments: true}],
  'no-restricted-syntax': ['error', ...DISALLOWED_SYNTAX],
}

const semanticsRules = {
  'class-methods-use-this': [
    'error',
    {
      'exceptMethods': [
        'render',
        'getInitialState',
        'getDefaultProps',
        'getChildContext',
        'componentWillMount',
        'UNSAFE_componentWillMount',
        'componentDidMount',
        'componentWillReceiveProps',
        'UNSAFE_componentWillReceiveProps',
        'shouldComponentUpdate',
        'componentWillUpdate',
        'UNSAFE_componentWillUpdate',
        'componentDidUpdate',
        'componentWillUnmount',
        'componentDidCatch',
        'getSnapshotBeforeUpdate',
      ],
    },
  ],
  'no-param-reassign': ['warn', {props: false}],
  'no-plusplus': 'off',
  'no-var': 'error',
  'react/destructuring-assignment': 'off',
  'react/prop-types': 'off',
  'no-unused-expressions': ['error', {allowShortCircuit: true, allowTernary: true}],
}

const projectRules = {
  'import/no-extraneous-dependencies': 'off',
  'import/no-duplicates': 'off',  // https://github.com/benmosher/eslint-plugin-import/issues/1403
  'no-unused-vars': 'off',
  'react/jsx-filename-extension': ['error', {'extensions': ['.tsx', '.jsx']}],
}

const domRules = {
  'jsx-a11y/label-has-for': ['off'],  // Deprecated
}

// TODO(christoph) Replace with typescript-aware rules
const typescriptOverrides = {
  'no-undef': 'off',
  'no-unused-vars': 'off',
  'no-restricted-globals': 'off',
}

const globalVariables = {
  'AFRAME': 'readonly',
  'XR8': 'readonly',
  'THREE': 'readonly',
  'BABYLON': 'readonly',
  'XRExtras': 'readonly',
  'HoloVideoObject': 'readonly',
  'HoloVideoObjectThreeJS': 'readonly',
  'React': 'readonly',
  'ReactDOM': 'readonly',
  'ReactRouterDOM': 'readonly',
  'Vue': 'readonly',
}

const baseRules = {
  ...baseAirbnbRulesBestPractices,
  ...baseAirbnbRulesEs6,
  ...baseAirbnbRulesErrors,
  ...baseAirbnbRulesStrict,
  ...baseAirbnbRulesStyle,
  ...baseAirbnbRulesVariables,
  ...spacingRules,
  ...syntaxRules,
  ...semanticsRules,
  ...projectRules,
  ...domRules,
}

const typescriptRules = {
  ...baseRules,
  ...typescriptOverrides,
}

const getRules = filename => ({
  'env': {
    browser: true,
    es6: true,
    commonjs: true,
  },
  'globals': {
    ...globalVariables,
  },
  'parser': 'current-babel-eslint',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
    'warnOnUnsupportedTypeScriptVersion': false,
  },
  'rules': filename.match(/\.tsx?/) ? typescriptRules : baseRules,
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
})

export {
  getRules,
}
