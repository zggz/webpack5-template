process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'
process.on('unhandledRejection', (err) => {
  throw err
})
import { initArguments, packageJson } from './utils/index.js'
import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'

import chalk from 'chalk'

import webpackBaseConfig from './webpack.base.conf.js'
import getDevServer from './utils/devServer.js'
import config from '../config/index.js'
import SpeedMeasurePlugin from "speed-measure-webpack-plugin"

const smp = new SpeedMeasurePlugin();
initArguments()


import { choosePort, isInteractive, clearConsole, printInstructions} from './utils/index.js'

function startDevServer(webpackConfig, serverConfig) {

  return new Promise((resolve, reject) => {
    const devServerConfig = Object.assign({}, serverConfig)
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const { port, host } = devServerConfig
    console.log(devServerConfig);
    try {
      const  compiler = webpack(webpackConfig);
      const devServer = new WebpackDevServer(devServerConfig, compiler)

      const runServer = async () => {
        console.log('Starting server...');
        await devServer.start();
        console.log(isInteractive, '=============');
        if (isInteractive) {
          clearConsole()
        }
        console.log(chalk.cyan('Starting the development server...\n'))
        printInstructions(packageJson.name, protocol, host, port, config.useYarn )
      };

      const stopServer = async () => {
        console.log('Stopping server...');
        await devServer.stop();
      };

      runServer();
    } catch (err) {
      console.log(chalk.red('Failed to compile.'));
      console.log();
      console.log(err.message || err);
      console.log();
      process.exit(1);
    } 
  })
}

async function main() {
 
  const devServerConfig = getDevServer(config)
  const webpackConfig = await webpackBaseConfig()
  choosePort(devServerConfig.host, devServerConfig.port).then((port) => {
    console.log(process.env.PORT, parseInt("8090"));
    devServerConfig.port = Number(process.env.PORT)
    startDevServer(webpackConfig, devServerConfig)
  })
}

main()
