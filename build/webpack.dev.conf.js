'use strict'
import * as utils from './loader.js'
import webpack from 'webpack'
import config from '../config/index.js'
import { merge } from 'webpack-merge'
import path from 'path'
import chalk from 'chalk'

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import baseWebpackConfig from './webpack.base.conf.js'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
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
    }),
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
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
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: ${config.dev.https ? 'https' : 'http'}://${config.dev.host}:${config.dev.port}`],
      },
      onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined,
      clearConsole: true,
    }),
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
