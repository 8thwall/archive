import path from 'path'
import nodeExternals from 'webpack-node-externals'
import CopyPlugin from 'copy-webpack-plugin'
import type {Configuration} from 'webpack'

import {getWebpackAliases} from './alias-config'
import {makeNoExternalImportsPlugin} from './config/no-external-imports-plugin'

export default ({replacements, extraPlugins = []}): Configuration => ({
  entry: './src/server/apps-server-entry.ts',
  output: {
    path: path.join(__dirname, 'server-dist'),
    filename: 'apps.js',
    hashFunction: 'sha512',
  },
  resolve: {
    alias: getWebpackAliases(),
    extensions: ['.ts', '.js'],
    symlinks: false,
  },
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {multiple: replacements},
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: [
                '@babel/plugin-proposal-export-default-from',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-export-namespace-from',
                '@babel/plugin-transform-modules-commonjs',
                '@babel/plugin-transform-runtime',
                '@babel/plugin-transform-object-assign',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-optional-chaining',
              ],
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {from: './src/server/favicon.png', to: 'favicon.png'},
        {from: './src/server/public', to: 'public'},
        {from: './src/server/templates', to: 'templates'},
        {from: './src/server/scripts', to: 'scripts'},
        {from: './src/server/i18n', to: 'i18n'},
      ],
    }),
    makeNoExternalImportsPlugin(__dirname),
    ...extraPlugins,
  ],
  devtool: 'source-map',
  mode: 'none',
  optimization: {
    minimize: false,
  },
})
