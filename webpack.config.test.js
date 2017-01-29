const nodeExternals = require('webpack-node-externals');


module.exports = {
  target: 'node',
  module: {
    loaders: [
      { test: /\.json/, loader: 'json-loader' }
    ]
  },
  externals: [nodeExternals()], // ignore node_modules
  devtool: "cheap-module-source-map"
};
