'use strict'
import * as utils from './utils.js'
import webpack from 'webpack'
import config from '../config/index.js'
import { merge } from 'webpack-merge'
import path from 'path'
import baseWebpackConfig from './webpack.base.conf.js'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import portfinder from 'portfinder'
import devConfigEnv from '../config/dev.env.js'

import { fileURLToPath } from 'node:url';


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
  devServer: {
    client: {
      logging: 'info',
      overlay: config.dev.errorOverlay
        ? { warnings: false, errors: true }
        : false,
      progress: true,
    },
    compress: true,
    allowedHosts: config.dev.allowedHosts.length > 1 ? config.dev.allowedHosts : 'all',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    proxy: config.dev.proxyTable,
  },
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
    })
  ]
})

// export default new Promise((resolve, reject) => {
//   portfinder.basePort = process.env.PORT || config.dev.port
//   portfinder.getPort((err, port) => {
//     if (err) {
//       reject(err)
//     } else {
//       // publish the new Port, necessary for e2e tests
//       process.env.PORT = port
//       // add port to devServer config
//       devWebpackConfig.devServer.port = port

//       // Add FriendlyErrorsPlugin
//       // devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
//       //   compilationSuccessInfo: {
//       //     messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
//       //   },
//       //   onErrors: config.dev.notifyOnErrors
//       //     ? utils.createNotifierCallback()
//       //     : undefined
//       // }))
//       if (config.dev.useEslint) {
//         devWebpackConfig.plugins.push(
//           new ESLintPlugin({
//             fix: true, // 启用ESLint自动修复功能
//             extensions: ['js', 'jsx'],
//             context: path.resolve(__dirname, '../src'), // 文件根目录
//             exclude: '/node_modules/',// 指定要排除的文件/目录
//             cache: true //缓存
//           })
//         )
//       }
//       resolve(devWebpackConfig)
//     }
//   })
// })
