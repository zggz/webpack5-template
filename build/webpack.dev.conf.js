'use strict'
import * as utils from './loader.js'
import webpack from 'webpack'
import config from '../config/index.js'
import { merge } from 'webpack-merge'
import path from 'path'

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import baseWebpackConfig from './webpack.base.conf.js'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import devConfigEnv from '../config/dev.env.js'

import { fileURLToPath } from 'node:url';

console.log(import.meta.url, 'import.meta.url');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

export default merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  plugins: [
    new webpack.DefinePlugin({
      'process.env': devConfigEnv
    }),
    new webpack.HotModuleReplacementPlugin(),
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
          from: path.resolve(__dirname, '../static'),
          to: config.dev.assetsSubDirectory,
          globOptions: {
            ignore: ['.*']
          }
        }
      ]
    }),
  
    config.dev.useTypeScript &&
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        mode: 'write-references',
      },
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}'
      },
      async: true
      // formatter: isEnvProduction ? typescriptFormatter : undefined
    }),
    new ReactRefreshWebpackPlugin(),
    config.dev.useEslint && new ESLintPlugin({
      fix: true, // 启用ESLint自动修复功能
      extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
      context: path.resolve(__dirname, '../src'), // 文件根目录
      exclude: ['/node_modules/', '/test/'],// 指定要排除的文件/目录
      cache: true, //缓存
      cacheLocation: path.resolve(__dirname,
        "../node_moudles",
        '.cache/.eslintcache'
      ),
    })
  ].filter(Boolean),

})