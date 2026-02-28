const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'embed8.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'embed8',
    libraryTarget: 'umd',
  },
  devServer: {
    // contentBase is your current directory
    compress: true,
    port: 9000,
    https: true,
    hot: false,
    liveReload: false,
    inline: false,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }, {
        test: /\.html$/,
        use: 'html-loader',
      }, {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            }
          }
        ]
      }
    ]
  }
}
