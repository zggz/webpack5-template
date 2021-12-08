process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

process.on('unhandledRejection', (err) => {
  throw err
})

import WebpackDevServer from 'webpack-dev-server'


import chalk from 'chalk'

import webpackConfig from './webpack.dev.conf.js'
import getDevServer from './utils/devServer.js'
import config from '../config/index.js'

import { choosePort, isInteractive, clearConsole, createCompiler, prepareUrls} from './utils/index.js'
// import paths from '../build/paths'
// const { registerEnvs } from '../build/env')

function startDevServer(webpackConfig, serverConfig) {

  return new Promise((resolve, reject) => {
    const devServerConfig = Object.assign({}, serverConfig)
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const { port, host: HOST } = devServerConfig
    // const compiler = webpack(webpackConfig)
    const compiler = createCompiler({
      config: webpackConfig,
      useTypeScript: true,
      useYarn: true,
      appName: 'my-project',
      urls: prepareUrls(protocol, HOST, port, config.dev.assetsPublicPath.slice(0, -1))
    })
    const devServer = new WebpackDevServer(devServerConfig, compiler)

   
    // devServer.start()
    devServer.startCallback((err) => {
      console.log(isInteractive, '=============');
      if (err) {
        return console.log(err);
      }
    
      if (isInteractive) {
        clearConsole()
      }

      // if (env.raw.FAST_REFRESH && semver.lt(react.version, '16.10.0')) {
      //   console.log(
      //     chalk.yellow(
      //       `Fast Refresh requires React 16.10 or higher. You are using React ${react.version}.`
      //     )
      //   )
      // }

      console.log(chalk.cyan('Starting the development server...\n'))
      // openBrowser(urls.localUrlForBrowser)
    })


    //   ;['SIGINT', 'SIGTERM'].forEach(function (sig) {
    //     process.on(sig, function () {
    //       devServer.stop()
    //       process.exit()
    //     })
    //   })

    // if (process.env.CI !== 'true') {
    //   // Gracefully exit when stdin ends
    //   process.stdin.on('end', function () {
    //     devServer.stop()
    //     process.exit()
    //   })
    // }
  })
}

async function main() {
  const devServerConfig = getDevServer(config)
  const PORT = process.env.PORT || devServerConfig.port
  const HOST = process.env.HOST || devServerConfig.host
  choosePort(HOST, PORT).then((port) => {
    devServerConfig.port = port
    startDevServer(webpackConfig, devServerConfig)
  })
}

main()
