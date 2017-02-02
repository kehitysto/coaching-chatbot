const path = require('path');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');


module.exports = {
  entry: {
    'facebook-messenger/handler': './src/facebook-messenger/handler.js',
  },
  target: 'node',
  externals: [
    'aws-sdk'
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      { test: /\.json/, loader: 'json-loader' }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: '.env' }
    ]),
    new Dotenv({
      safe: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
        drop_debugger: true
      }
    })
  ],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  devtool: "source-map"
};
