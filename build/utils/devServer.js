
import path from 'path'
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const getDevServer = function (config) {
  return {
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
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    proxy: config.dev.proxyTable,
    onListening: function (devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      const port = devServer.server.address().port;
      console.log('Listening on port:', port);
    },
  }
 }

export default getDevServer