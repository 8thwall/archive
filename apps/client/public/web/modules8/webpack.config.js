const path = require('path')

module.exports = {
  entry: './src/index.ts',
  output: {filename: 'modules8.js', path: path.resolve(__dirname, 'dist')},
  optimization: {minimize: true},
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        exclude: [/node_modules/],
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
                '@babel/plugin-transform-runtime',
                '@babel/plugin-transform-object-assign',
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
  mode: 'production',
  devServer: {
    port: 9006,
    https: true,
    hot: true,
  },
}
