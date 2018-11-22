/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env = require('yargs').argv.env; 
const CleanWebpackPlugin = require('clean-webpack-plugin');
// contains externals function that ignores node_modules when bundling in Webpack
const nodeExternals = require('webpack-node-externals');

let fib2 = 'fib2', fib2editor = 'fib2-editor';

let pathsToClean = [
  'dist'
];

let plugins = [];

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  fib2 = fib2 + '.min';
  fib2editor = fib2editor + '.min';
} else if (env === 'dev') {
  plugins.unshift(new CleanWebpackPlugin(pathsToClean));
}

const config = {
  entry: {
    [fib2] : __dirname + '/src/js/index.js',
    [fib2editor] : __dirname + '/src/js/fib-editor/fib2editor.js',
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ] 
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ] 
      }            
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  plugins: plugins,
  externals: nodeExternals(), // in order to avoid bundling of modules in node_modules folder 
  devServer: {
    port: 9000
  }
};

module.exports = config;
