const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    'embed8-react': './src/embed8-react.jsx',
    'example': './example/test.jsx',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'embed8-react',
    libraryTarget: 'umd',
  },
  devServer: {
    // contentBase is your current directory
    compress: true,
    port: 9001,
    https: true,
    hot: false,
    liveReload: false,
    inline: false,
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  externals: {
    react: 'react',
    reactDOM: 'react-dom',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
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
            },
          },
        ],
      }, {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './example/test.html',
      filename: './example.html',
    }),
  ],
}
