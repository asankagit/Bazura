const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/handlers/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  devtool: 'source-map',
  mode: "production",
  // Work around "Error: Can't resolve 'pg-native'"
  plugins: [
    // new webpack.IgnorePlugin(/^pg-native$/)
  ],
  externals: [nodeExternals()], 
  resolve: {
    modules: ['node_modules'],
  },
};