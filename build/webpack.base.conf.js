'use strict'
import path from 'node:path';

import * as utils from './loader.js'
import config from '../config/index.js'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
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
    app: './src/index.tsx'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
     extensions: ['.wasm', '.mjs', '.js', '.jsx','.tsx', '.json'] ,
    alias: {
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          },
        },
        exclude: /(node_modules)/,
        include: [resolve('src')],
        
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
  // plugins: [
  //   new ProgressBarPlugin({
  //     format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
  //   }),
  //   config.useTypeScript &&
  //   new ForkTsCheckerWebpackPlugin({
  //     typescript: {
  //       mode: 'write-references',
  //       typescriptPath: resolve.sync('typescript')
  //     },
  //     eslint: {
  //       files: './src/**/*.{ts,tsx,js,jsx}'
  //     },
  //     async: isEnvDevelopment
  //     // formatter: isEnvProduction ? typescriptFormatter : undefined
  //   }),
  // ].filter(Boolean),
  node: {
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    global: false,
    __filename: false,
    __dirname: false,
  }
}
