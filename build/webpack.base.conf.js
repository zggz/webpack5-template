'use strict'
import path from 'node:path';

import chalk from 'chalk'
import * as utils from './utils.js'
import config from '../config/index.js'
import vueLoaderConfig from './vue-loader.conf.js'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import { fileURLToPath } from 'node:url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// const createLintingRule = () => ({
//   test: /\.(js|vue)$/,
//   loader: 'eslint-loader',
//   enforce: 'pre',
//   include: [resolve('src'), resolve('test')],
//   options: {
//     formatter: require('eslint-friendly-formatter'),
//     emitWarning: !config.dev.showEslintErrorsInOverlay
//   }
// })

export default {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
     extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json'] ,
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: vueLoaderConfig
        }
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false, // 这里设置为false
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false, // 这里设置为false
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false, // 这里设置为false
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
    })
  ],
  node: {
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    global: false,
    __filename: false,
    __dirname: false,
  }
}
