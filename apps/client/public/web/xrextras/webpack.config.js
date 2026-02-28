const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'external/xrextras/xrextras.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {loader: 'css-loader', options: {url: false}},
        ],
      }, {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {sources: false},
        },
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {from: 'resources', to: 'external/xrextras/resources'},
        {from: 'xrextras-shared-resources', to: 'external/xrextras-shared-resources'},
        {from: 'test/index.html', to: 'index.html'},
        {from: 'test/index-aframe.html', to: 'index-aframe.html'},
        {from: 'test/index.js', to: 'index.js'},
        {from: 'LICENSE', to: 'external/xrextras/'},
        {from: 'xrextras-shared-resources/LICENSE', to: 'external/xrextras-shared-resources/'},
      ],
    }),
  ],
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    https: true,
    hot: false,
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
}
