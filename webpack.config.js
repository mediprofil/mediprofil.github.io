const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const path = require("path");

module.exports = (env, argv) => ({
  output: {
    filename: '[name].[chunkhash].js'
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
      hash: argv.mode === 'production'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: argv.mode === 'development',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: _ => [require('precss'), require('autoprefixer')]
            }
          },
          'sass-loader',
        ],
      },
    ],
  },
})
