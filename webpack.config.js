const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv-webpack');

module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, "build")
  },
  devtool: 'eval-source-map',
  mode: 'development',
  devServer: {
    host: 'localhost',
    port: 8080,
    static: {
      directory: path.resolve(__dirname, 'build'),
      publicPath: '/'
    },
    // proxy: [
    //   {
    //     context: ['/', '/restarted', '/graphData', '/config'],
    //     target: 'http://localhost:3333/',
    //     secure: false,
    //   },
    // ],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpeg|gif|svg)$/i,
        type: 'asset/resource'
      },
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              targets: 'defaults',
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ]
      },
      {
        test: /.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/'
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './client/assets/logoDesignFavicon.png'
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}