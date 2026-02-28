const path = require('path')

const rules = [
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {loader: 'babel-loader', options: {presets: [require.resolve('@babel/preset-env')]}},
  },
  {
    test: /\.ts$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  },
]

module.exports = {
  entry: './src/app8.js',
  output: {filename: 'app8.js', path: path.resolve(__dirname, 'dist')},
  optimization: {minimize: true},
  module: {rules},
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    port: 9004,
    https: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    allowedHosts: ['.8thwall.app'],
  },
}
