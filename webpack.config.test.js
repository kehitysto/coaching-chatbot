const nodeExternals = require('webpack-node-externals');


module.exports = {
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.json/, loader: 'json-loader' }
    ]
  },
  externals: [nodeExternals()], // ignore node_modules
  devtool: "cheap-module-eval-source-map"
};
