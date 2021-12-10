process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'
process.on('unhandledRejection', (err) => {
  throw err
})
import { initArguments, packageJson } from '../build/utils/index.js'
import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'

import chalk from 'chalk'

import webpackBaseConfig from '../build/webpack.base.conf.js'
import getDevServer from '../build/utils/devServer.js'
import config from '../build/config.js'
import SpeedMeasurePlugin from "speed-measure-webpack-plugin"
// eslint-disable-next-line no-unused-vars
const smp = new SpeedMeasurePlugin()
initArguments()


import { choosePort, isInteractive, clearConsole, printInstructions } from '../build/utils/index.js'

async function startDevServer() {

  const devServerConfig = getDevServer(config)
  const webpackConfig = await webpackBaseConfig()
  choosePort(devServerConfig.host, devServerConfig.port).then((port) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise(() => {
      const serverConfig = Object.assign(devServerConfig, {port})
      const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'

      try {
        const compiler = webpack(webpackConfig)
        const devServer = new WebpackDevServer(serverConfig, compiler)

        const runServer = async () => {
          console.log('Starting server...')
          await devServer.start()
          console.log(isInteractive, '=============')
          if (isInteractive)
            clearConsole()

          console.log(chalk.cyan('Starting the development server...\n'))
          printInstructions(packageJson.name, protocol, serverConfig.host, port, config.useYarn)
        }

        // eslint-disable-next-line no-unused-vars
        const stopServer = async () => {
          console.log('Stopping server...')
          await devServer.stop()
        }

        runServer()
      } catch (err) {
        console.log(chalk.red('Failed to compile.'))
        console.log()
        console.log(err.message || err)
        console.log()
        process.exit(1)
      }
    })
  })
}

await startDevServer()
