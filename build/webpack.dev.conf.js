'use strict'
import * as utils from './loader.js'
import webpack from 'webpack'
import config from '../config/index.js'
import { merge } from 'webpack-merge'

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import baseWebpackConfig from './webpack.base.conf.js'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import ESLintPlugin from 'eslint-webpack-plugin'
import { resolvePath } from './utils/index.js'


const baseConfig =  await baseWebpackConfig()
console.log(config);
export default merge(baseConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  plugins: [
    
    // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new MiniCssExtractPlugin({ filename: utils.assetsPath('css/[name].[contenthash].css') }),

    // copy custom static assets
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
    new ReactRefreshWebpackPlugin(),
    config.dev.useEslint && new ESLintPlugin({
      fix: true, // 启用ESLint自动修复功能
      extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
      context: resolvePath('src'), // 文件根目录
      exclude: ['/node_modules/', '/test/'],// 指定要排除的文件/目录
      cache: true, //缓存
      cacheLocation: resolvePath(
        "node_modules",
        '.cache/.eslintcache'
      ),
    })
  ].filter(Boolean),

})