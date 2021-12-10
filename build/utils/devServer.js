
import path from 'path'
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const getDevServer = function (config) {
  return {
    client: {
      logging: 'info',
      overlay: config.errorOverlay
        ? { warnings: false, errors: true }
        : false,
      progress: true,
    },
    compress: true,
    allowedHosts: config.allowedHosts.length > 1 ? config.allowedHosts : 'all',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.assetsPublicPath, 'index.html') },
      ],
    },
    host: HOST || config.host,
    port: PORT || config.port,
    open: config.autoOpenBrowser,
    proxy: config.proxyTable || {},
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