'use strict'
import webpack from 'webpack'

import * as utils from './loader.js'
import config from '../config/index.js'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import chalk from 'chalk'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import StylelintPlugin from 'stylelint-webpack-plugin'
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"


import { resolvePath, getEnv} from './utils/index.js'





const webpackBaseConfig = async () => {
  return {
    target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
      context: resolvePath(),
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
      // fix: Field 'browser' doesn't contain a valid alias configuration
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.tsx', '.ts', '.json'],
        alias: {
        '@': resolvePath('src'),
    }
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: [
                process.env.NODE_ENV === 'development' &&
                "react-refresh/babel"
              ].filter(Boolean)
            },
          },
          exclude: /(node_modules)/,
          include: [resolvePath('src')],
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
    optimization: {
      minimize: true,
        runtimeChunk: 'single',
          moduleIds: 'deterministic',
            minimizer: [
              new TerserPlugin(),
              new CssMinimizerPlugin(),
            ],
              splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
              test: /[\\/]node_modules[\\/]/,
                priority: -10,
                  chunks: 'initial'
          },
          common: {
            name: 'chunk-common',
              minChunks: 2,
                priority: -20,
                  chunks: 'initial',
                    reuseExistingChunk: true
          }
        }
      }
    },
    plugins: [
      new webpack.DefinePlugin(Object.assign(await getEnv(process.env.NODE_ENV), {
        'process.env':{}
      })),
      new ProgressBarPlugin({
        format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
      }),
      new StylelintPlugin(),
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
    ].filter(Boolean),
      node: {
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      global: false,
        __filename: false,
          __dirname: false,
  },
    // cache: {
    //   // 将缓存类型设置为文件系统      
    //   type: "filesystem",
    //   buildDependencies: {
    //     /* 将你的 config 添加为 buildDependency，           
    //        以便在改变 config 时获得缓存无效*/
    //     config: [__filename],
    //     /* 如果有其他的东西被构建依赖，           
    //        你可以在这里添加它们*/
    //     /* 注意，webpack.config，           
    //        加载器和所有从你的配置中引用的模块都会被自动添加*/
    //   },
    //   // 指定缓存的版本      
    //   version: '1.0'
    // }
  }
}




export default webpackBaseConfig