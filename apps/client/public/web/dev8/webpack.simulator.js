const path = require('path')
const webpack = require('webpack')

const rules = [
  {
    test: /\.(j|t)s$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript',
        ],
      },
    },
  },
  {test: /\.css$/, use: ['style-loader', 'css-loader']},
  {test: /\.html$/, use: {loader: 'html-loader'}},
]

module.exports = {
  entry: './src/xrsimulator/entry.ts',
  output: {
    filename: 'simulator8.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      append: '//# sourceURL=simulator8.js',
    }),
  ],
  devServer: {
    compress: true,
    port: 9021,
    https: true,
    hot: false,
    liveReload: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  optimization: {minimize: true},
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {rules},
  mode: 'production',
}
