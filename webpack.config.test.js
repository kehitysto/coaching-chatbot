const nodeExternals = require('webpack-node-externals');


module.exports = {
  output: {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      { test: /\.json/, loader: 'json-loader' }
    ]
  },
  externals: [nodeExternals()], // ignore node_modules
  devtool: "inline-cheap-module-source-map"
};
