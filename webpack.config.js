const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => ({
  devServer: {
    port: 8080
  },
  entry: {
    app: path.resolve(__dirname, './src/index.js'),
    vendor: ['phaser'],
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
  },
  devtool: argv.mode === 'development' ? 'eval-cheap-module-source-map' : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: argv.mode === 'production',
          },
        },
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV: argv.mode === 'development',
      WEBGL_RENDERER: true,
      CANVAS_RENDERER: true,
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(
      {
        patterns: [
          { from: 'src/assets', to: 'assets' },
          { from: 'src/favicon.ico', to: 'favicon.ico' }
        ]
      }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
    }),
  ],
  // optimization: {
  //   splitChunks: {
  //     name: 'vendor',
  //     chunks: 'all',
  //   },
  // },
});
