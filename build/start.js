process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

process.on('unhandledRejection', (err) => {
  throw err
})

import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'

import chalk from 'chalk'

import webpackConfig from './webpack.dev.conf.js'
import getDevServer from './utils/devServer.js'
import config from '../config/index.js'
import SpeedMeasurePlugin from "speed-measure-webpack-plugin"

const smp = new SpeedMeasurePlugin();

import { choosePort, isInteractive, clearConsole, printInstructions} from './utils/index.js'
// import paths from '../build/paths'
// const { registerEnvs } from '../build/env')

function startDevServer(webpackConfig, serverConfig) {

  return new Promise((resolve, reject) => {
    const devServerConfig = Object.assign({}, serverConfig)
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const { port, host } = devServerConfig
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
        setTimeout(() => {
          printInstructions('my-pro', protocol, host, port, config.dev.useYarn )
        }, 1000);
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
  choosePort(devServerConfig.host, devServerConfig.port).then((port) => {
    devServerConfig.port = port
    startDevServer(webpackConfig, devServerConfig)
  })
}

main()
