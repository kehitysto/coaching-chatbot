const nodeExternals = require('webpack-node-externals');
const path = require('path');
const isCoverage = process.env.NODE_ENV === 'coverage';


module.exports = {
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
  target: 'node',
  module: {
    loaders: [].concat(
      isCoverage ? {
          test: /\.js$/,
          include: path.resolve('src'),
          exclude: [
            path.resolve('src/coaching-chatbot/dialog.js'),
          ],
          // instrument only testing sources with Istanbul, after ts-loader runs
          loader: 'istanbul-instrumenter-loader',
        }: [],
      [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'awesome-typescript-loader',
        },
        { test: /\.json/, loader: 'json-loader' },
      ]
    ),
  },
  externals: [nodeExternals()], // ignore node_modules
  devtool: 'source-map',
};
