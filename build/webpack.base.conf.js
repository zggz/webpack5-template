'use strict'
import webpack from 'webpack'

import * as utils from './loader.js'
import CONFIG from '../config/index.js'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import chalk from 'chalk'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import StylelintPlugin from 'stylelint-webpack-plugin'
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import ESLintPlugin from 'eslint-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import WebpackBundleAnalyzer from 'webpack-bundle-analyzer'
import CompressionWebpackPlugin from 'compression-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
const BundleAnalyzerPlugin = WebpackBundleAnalyzer.BundleAnalyzerPlugin



import { resolvePath, getEnv } from './utils/index.js'





const webpackBaseConfig = async () => {
  const env = await getEnv()

  const isEnvDevelopment = process.env.NODE_ENV === 'development';
  const isEnvProduction = process.env.NODE_ENV === 'production';
  console.log(CONFIG);
  return {
    mode: isEnvProduction ? 'production' : 'development',
    target: isEnvDevelopment ? "web" : "browserslist",
    devtool: isEnvDevelopment ? CONFIG.devtool : none,
    context: resolvePath(""),
    entry: {
      app: './src/index.tsx'
    },
    output: {
      path: CONFIG.assetsRoot,
      filename: isEnvProduction ? utils.assetsPath('js/[name].[contenthash].js') : '[name].js',
      chunkFilename: isEnvProduction
        ? utils.assetsPath('js/[name].[contenthash:8].chunk.js')
        : isEnvDevelopment && utils.assetsPath('js/[name].[id].js'),
      publicPath: CONFIG.assetsPublicPath
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
                isEnvDevelopment &&
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
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: CONFIG.appHtml,
        inject: true,
        minify: {
          removeComments: isEnvProduction,
          collapseWhitespace: isEnvProduction,
          removeAttributeQuotes: isEnvProduction
        },
        chunksSortMode: 'auto'
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: resolvePath('static'),
            to: CONFIG.assetsSubDirectory,
            globOptions: {
              ignore: ['.*']
            }
          }
        ]
      }),
      new MiniCssExtractPlugin({ filename: utils.assetsPath('css/[name].[contenthash].css') }),
      isEnvDevelopment && new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin(Object.keys(env).reduce((a, b) => {
        a[`process.env.${b}`] = env[b]
        return a
      }, { 'process.env': {} })),
      new ProgressBarPlugin({
        format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
      }),
      new StylelintPlugin(),
      CONFIG.useTypeScript &&
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
      isEnvDevelopment && new ReactRefreshWebpackPlugin(),
      CONFIG.useEslint && new ESLintPlugin({
        fix: true, // 启用ESLint自动修复功能
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        context: resolvePath('src'), // 文件根目录
        exclude: ['/node_modules/', '/test/'],// 指定要排除的文件/目录
        cache: true, //缓存
        cacheLocation: resolvePath(
          "node_modules",
          '.cache/.eslintcache'
        ),
      }),
      isEnvProduction && CONFIG.productionGzip && new CompressionWebpackPlugin({
        // asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          CONFIG.productionGzipExtensions.join('|') +
          ')$'
        ),
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: true,
      }),
      CONFIG.bundleAnalyzerReport && new BundleAnalyzerPlugin(),
      isEnvProduction && new webpack.optimize.ModuleConcatenationPlugin(),
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