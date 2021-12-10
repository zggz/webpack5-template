import { resolvePath } from "./utils/index.js";

export default {

  host: 'localhost', // can be overwritten by process.env.HOST
  port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
  autoOpenBrowser: true,
  errorOverlay: true,
  notifyOnErrors: true,
  useEslint: true,
  useTypeScript: true,
  useYarn: true,
  devtool: 'eval-source-map',
  cssSourceMap: true,
  allowedHosts: [],

  // 静态目录
  assetsSubDirectory: 'static',
  // 插入js、css地址前缀
  assetsPublicPath: "/",
  // 模板地址
  appHtml: resolvePath('index.html'),
  // 输出目录
  assetsRoot: resolvePath('dist'),
  // 以下配置 必须要  production
  productionGzip: false,
  productionGzipExtensions: ['js', 'css'],
  bundleAnalyzerReport: process.env.npm_config_report

}
