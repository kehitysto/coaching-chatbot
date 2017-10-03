const path = require('path');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: {
    'src/facebook-messenger/handler': './src/facebook-messenger/handler.js',
  },
  target: 'node',
  externals: [
    'aws-sdk',
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'awesome-typescript-loader',
      },
      { test: /\.json/, loader: 'json-loader' },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: '.env' },
    ]),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  devtool: 'source-map',
};
