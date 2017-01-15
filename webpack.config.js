const path = require('path');
const webpack = require('webpack');
const cssnext = require('postcss-cssnext');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const production = process.env.NODE_ENV === 'production';
const appSrc = path.resolve(__dirname, 'src');
const appEntry = path.join(appSrc, 'index.js');
const appHtml = path.join(appSrc, 'index.html');

const plugins = {
  prod: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new HtmlWebpackPlugin({ inject: true, template: appHtml, minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new ExtractTextWebpackPlugin('bundle.[contenthash:8].css', { allChunks: true }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      // React doesn't support IE8
      compress: { screw_ie8: true, warnings: false },
      mangle: { screw_ie8: true },
      output: { screw_ie8: true, comments: false }}),
  ],
  dev: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new HtmlWebpackPlugin({ inject: true, template: appHtml }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
};

const styleLoader = {
  prod: ExtractTextWebpackPlugin.extract('style', ['css', 'postcss']),
  dev: 'style!css!postcss',
};

const config = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill', // polyfill (promise, Map, etc)
    'whatwg-fetch',   // polyfill (fetch)
    appEntry,
  ],
  output: {
    path: './build',
    filename: 'bundle.[hash:8].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css'],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules'),
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  devServer: {
    quiet: false,
    historyApiFallback: true,
    contentBase: './build'
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: appSrc,
      }
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        include: appSrc,
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: production ? styleLoader.prod : styleLoader.dev,
        include: appSrc,
      },
      {
        test: /\.(ico|jpg|png|gif|eot|otf|svg|ttf|woff|woff2)$/,
        loader: 'file',
        include: appSrc,
        exclude: /\/favicon.ico$/,
        query: { name: 'media/[name].[hash:8].[ext]' }
      },
    ],
  },
  postcss: [cssnext],
  plugins: production ? plugins.prod : plugins.dev,
};

module.exports = config;
