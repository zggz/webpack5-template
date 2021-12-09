'use strict'
import path from 'path'
import * as  utils from './loader.js'
import fs from 'fs'
import { readFile } from 'fs/promises';
import webpack from 'webpack'
import config from '../config/index.js'
import { merge } from 'webpack-merge'
import baseWebpackConfig from './webpack.base.conf.js'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import WebpackBundleAnalyzer from 'webpack-bundle-analyzer'
import CompressionWebpackPlugin from 'compression-webpack-plugin'
import { resolvePath } from './utils/index.js'
const BundleAnalyzerPlugin = WebpackBundleAnalyzer.BundleAnalyzerPlugin


const webpackConfig = async () => {
  const baseConfig =await baseWebpackConfig()
  const prodConfig =   {
    mode: 'production',
    module: {
      rules: utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true,
        usePostCSS: true
      })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
      path: config.build.assetsRoot,
      filename: utils.assetsPath('js/[name].[chunkhash].js'),
      chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },

    plugins: [
      new MiniCssExtractPlugin(),
      new MiniCssExtractPlugin({ filename: utils.assetsPath('css/[name].[contenthash].css') }),
      new HtmlWebpackPlugin({
        filename: process.env.NODE_ENV === 'testing'
          ? 'index.html'
          : config.build.index,
        template: 'index.html',
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'auto'
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),


      new CopyWebpackPlugin({
        patterns: [
          {
            from: resolvePath('static'),
            to: config.dev.assetsSubDirectory,
            globOptions: {
              ignore: ['.*']
            }
          }
        ]
      }),
      config.build.productionGzip && new CompressionWebpackPlugin({
        // asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          config.build.productionGzipExtensions.join('|') +
          ')$'
        ),
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: true,
      }),
      config.build.productionGzip && new BundleAnalyzerPlugin()
    ].filter(Boolean)
  }

  return merge(baseConfig, prodConfig)
}

export default webpackConfig
