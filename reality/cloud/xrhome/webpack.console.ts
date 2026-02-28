import path from 'path'
import nodeExternals from 'webpack-node-externals'
import CopyPlugin from 'copy-webpack-plugin'
import type {Configuration} from 'webpack'

import {getWebpackAliases} from './alias-config'
import {makeNoExternalImportsPlugin} from './config/no-external-imports-plugin'

export default ({replacements, extraPlugins = []}): Configuration => ({
  entry: './src/server/console-server.ts',
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'server-dist'),
    filename: 'console.js',
    hashFunction: 'sha512',
  },
  resolve: {
    alias: getWebpackAliases(),
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
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
        test: /\.(png|webp|svg|jpg|gif|ico|woff|woff2|eot|ttf|otf|mp4|webm)$/,
        loader: 'file-loader',
        options: {
          name: 'static/asset/[contenthash:hex:8]-[name].[ext]',
        },
      },
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
      },
      {
        test: /\.(j|t)sx?$/,
        exclude: [/node_modules/, /.*\/react-ace\/worker\/.*.js/],
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
                '@babel/plugin-transform-object-assign',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-optional-chaining',
              ],
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      node: 12,
                    },
                  },
                ],
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        ],
      },
      // NOTE(christoph): authzed-node uses ?? syntax which isn't supported natively by node 12,
      // which is the current version of node used by Elastic Beanstalk.
      // TODO(christoph): Remove after upgrading Elastic Beanstalk to AL2.
      {
        test: /\.(j|t)sx?$/,
        include: [/node_modules\/@authzed\/authzed-node\//],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: [
                '@babel/plugin-proposal-export-default-from',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-export-namespace-from',
                '@babel/plugin-transform-modules-commonjs',
                '@babel/plugin-transform-object-assign',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-optional-chaining',
              ],
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      node: 12,
                    },
                  },
                ],
                '@babel/preset-react',
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
        {from: './src/server/templates', to: 'templates'},
        {from: './src/server/scripts', to: 'scripts'},
        {from: './src/server/arcade/arcade-robots.txt', to: 'arcade/robots.txt'},
        {from: './src/server/arcade/arcade-sitemap.xml', to: 'arcade/sitemap.xml'},
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
