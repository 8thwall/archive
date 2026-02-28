// @rule(js_binary)
// @attr(export_library = 1)
// @package(npm-ecs-build)
// @attr(externals = "*")
// @attr(target = "node")
// @attr(esnext = 1)
// @attr(commonjs = 1)

import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

import type {Configuration} from 'webpack'

import AssetBundleResolverPlugin from './plugins/asset-bundle-resolver-plugin'
import AssetManifestPlugin from './plugins/asset-manifest-plugin'
import makeDependencyImportPlugin from './plugins/dependency-import-plugin'
import makeCodeFileImportPlugin from './plugins/code-import-plugin'

const buildPath = __dirname
const rootPath = process.cwd()
const distPath = path.join(rootPath, 'dist')
const srcPath = path.join(rootPath, 'src')
const genPath = path.join(rootPath, '.gen')

const config: Configuration = {
  entry: path.join(buildPath, 'entry.js'),
  output: {
    filename: '[name].js',
    path: distPath,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {'@8w-studio-project-src': srcPath},
    modules: [path.join(buildPath, 'modules'), 'node_modules'],
    plugins: [new AssetBundleResolverPlugin({srcPath})],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.join(rootPath, 'tsconfig.json'),
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\..*$/,
        include: [path.join(srcPath, 'assets')],
        loader: path.join(buildPath, 'asset-loader.js'),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(genPath, 'index.html'),
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(srcPath, 'assets'),
          to: path.join(distPath, 'assets'),
          noErrorOnMissing: true,
        },
      ],
    }),
    new AssetManifestPlugin({
      srcDir: srcPath,
      assetManifestPath: path.join(srcPath, '_asset-manifest.js'),
    }),
    makeDependencyImportPlugin({srcDir: srcPath, buildDir: buildPath}),
    makeCodeFileImportPlugin({srcDir: srcPath}),
  ],
  mode: 'development',
  externals: {
    '@8thwall/ecs': 'window.ecs',
  },
}

Object.assign(config, {
  devServer: {
    open: false,
    compress: true,
    // NOTE(dat): We are serving at http://localhost to avoid accepting certs but still have
    // camera access.
    hot: true,
    liveReload: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    allowedHosts: [
      'localhost',
    ],
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
      webSocketURL: 'auto://0.0.0.0:0/ws',
    },
  },
})

export default config
