const webpack = require('webpack')
const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: path.resolve(__dirname, 'build', 'src', 'cli.js'),
  devtool: './build/src/cli.js.map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'chob.js',
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
  ],
};
