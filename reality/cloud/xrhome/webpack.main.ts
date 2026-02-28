import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import {ProvidePlugin, type Configuration} from 'webpack'

import {getWebpackAliases} from './alias-config'
import {makeNoExternalImportsPlugin} from './config/no-external-imports-plugin'

// NOTE(christoph): Through the magic of Javascript, this function is embedded in the bundle
// and used by style-loader to insert styles before the server-side rendered styles. If we place
// them after, which is the default, it can override styles provided by JSS, which may not be loaded
// on the page yet.
function insertStylesBeforeServerSide(element: HTMLElement) {
  const target = document.getElementById('server-side-styles')

  if (target) {
    target.parentNode.insertBefore(element, target)
  } else {
    document.head.appendChild(element)
  }
}

const styleLoader = {
  loader: 'style-loader',
  options: {
    insert: insertStylesBeforeServerSide,
  },
}

export default ({
  isLocalDev, isProduction, deploymentPath, replacements, extraPlugins, allowSymlinkToExternal,
}): Configuration => ({
  entry: {
    main: './src/client/index.tsx',
    lightship: './src/client/lightship/index.tsx',
    arcade: './src/client/arcade/arcade-index.tsx',
  },
  output: {
    publicPath: (isLocalDev && process.env.HOT === '1') ? 'https://localhost:3601/' : '/',
    path: path.join(__dirname, 'dist'),
    filename: path.join(deploymentPath, '[name].bundle.js'),
    hashFunction: 'sha512',
  },
  externals: ['monaco-editor'],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    mainFields: ['module', 'browser', 'main'],
    symlinks: allowSymlinkToExternal,
    modules: allowSymlinkToExternal
      ? ['node_modules', path.resolve(__dirname, 'node_modules')]
      : ['node_modules'],
    alias: getWebpackAliases(),
    fallback: {
      /* eslint-disable local-rules/commonjs */
      assert: require.resolve('assert'),
      buffer: require.resolve('buffer'),
      console: require.resolve('console-browserify'),
      constants: require.resolve('constants-browserify'),
      crypto: require.resolve('crypto-browserify'),
      domain: require.resolve('domain-browser'),
      events: require.resolve('events'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      punycode: require.resolve('punycode'),
      process: require.resolve('process/browser'),
      querystring: require.resolve('querystring-es3'),
      stream: require.resolve('stream-browserify'),
      string_decoder: require.resolve('string_decoder'),
      sys: require.resolve('util'),
      timers: require.resolve('timers-browserify'),
      tty: require.resolve('tty-browserify'),
      url: require.resolve('url'),
      util: require.resolve('util'),
      vm: require.resolve('vm-browserify'),
      zlib: require.resolve('browserify-zlib'),
      /* eslint-enable local-rules/commonjs */
    },
  },
  module: {
    rules: [
      {
        'test': /\.worker\.js$/,  // for unconify.worker.js
        'use': 'worker-loader',
      },
      {
        test: [/ace-builds\/src-min-noconflict\/worker-.*.js/, /.*\/react-ace\/worker\/.*.js/],
        loader: 'raw-loader',
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
                '@babel/plugin-transform-runtime',
                '@babel/plugin-transform-object-assign',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-optional-chaining',
                // eslint-disable-next-line local-rules/commonjs
                isLocalDev && process.env.HOT === '1' && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                ['@babel/preset-typescript', {allowNamespaces: true}],
              ],
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [styleLoader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [styleLoader, 'css-loader'],
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.(png|webp|svg|jpg|gif|ico|woff|woff2|eot|ttf|otf|mp4|webm)$/,
        loader: 'file-loader',
        options: {
          name: 'static/asset/[contenthash:hex:8]-[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/client/static/index.html',
      chunks: ['main'],
      minify: {
        removeComments: false,
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'lightship.html',
      template: 'src/client/static/lightship.html',
      chunks: ['lightship'],
      minify: {
        removeComments: false,
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'arcade.html',
      template: 'src/client/static/arcade/arcade-index.html',
      chunks: ['arcade'],
      minify: {
        removeComments: false,
      },
    }),
    new ProvidePlugin({
      process: 'process/browser',
    }),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    allowSymlinkToExternal ? null : makeNoExternalImportsPlugin(__dirname),
    ...extraPlugins,
  ].filter(Boolean),
  mode: isProduction ? 'production' : 'development',
  optimization: {
    minimize: isProduction,
    minimizer: [new TerserPlugin({
      terserOptions: {
        sourceMap: true,
      },
    })],
  },
  experiments: {
    syncWebAssembly: true,
  },
})
