const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  entry: {
    'holovideoobject-0.2.2': './src/holovideoobject-0.2.2.js',
    'holovideoobject-1.2.5': './src/holovideoobject-1.2.5.js',
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            '@babel/preset-env',
          ],
        },
      },
    ],
  },
  mode: 'production'
}
