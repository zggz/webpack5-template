process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

process.on('unhandledRejection', (err) => {
  throw err
})
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import yargs from 'yargs'
import chalk from 'chalk'
import portfinder from 'portfinder'
import webpackConfig from './webpack.dev.conf.js'
// import paths from '../build/paths'
// const { registerEnvs } from '../build/env')

function startDevServer(webpackConfig) {

  return new Promise((resolve, reject) => {
    const devServerConfig = Object.assign({}, webpackConfig.devServer, {
      port:process.env.PORT
    })

    const compiler = webpack(webpackConfig)
    console.log('[ devServerConfig ] >', devServerConfig)
    const devServer = new WebpackDevServer(compiler, devServerConfig)

    const { port: PORT, host: HOST } = devServerConfig

    devServer.start()
    // devServer.startCallback(() => {
    //   // if (err) {
    //   //   return console.log(err);
    //   // }
    //   if (isInteractive) {
    //     clearConsole()
    //   }

    //   if (env.raw.FAST_REFRESH && semver.lt(react.version, '16.10.0')) {
    //     console.log(
    //       chalk.yellow(
    //         `Fast Refresh requires React 16.10 or higher. You are using React ${react.version}.`
    //       )
    //     )
    //   }

    //   console.log(chalk.cyan('Starting the development server...\n'))
    //   openBrowser(urls.localUrlForBrowser)
    // })

      ;['SIGINT', 'SIGTERM'].forEach(function (sig) {
        process.on(sig, function () {
          devServer.stop()
          process.exit()
        })
      })

    if (process.env.CI !== 'true') {
      // Gracefully exit when stdin ends
      process.stdin.on('end', function () {
        devServer.stop()
        process.exit()
      })
    }
  })
}

function choosePort(defaultPort) {
  portfinder.basePort = defaultPort

  return portfinder
    .getPortPromise()
    .then((port) => {
      console.log(port, defaultPort);
      if (port !== defaultPort) {
        console.log(
          chalk.bgYellow(chalk.black(' WARNING ')) +
          ' ' +
          chalk.yellow(`The port:${defaultPort} is occupied. `) +
          chalk.green(`Run the app on another port:${port} instead!`)
        )
      }

      return Promise.resolve(port)
    })
    .catch((err) => {
      throw new Error(
        chalk.red('No free port is found, please kill the process port and try again.') +
        '\n' +
        ('Network error message: ' + err.message || err) +
        '\n'
      )
    })
}

async function checkRunEnv(port) {
  process.env.PORT = await choosePort(Number.parseInt(port))
  // process.env.MOCK_PORT = await choosePort(Number.parseInt(process.env.MOCK_PORT))
  // you can do any check here, such as system, browser, network ...
}

async function main() {
  console.log(webpackConfig);
  checkRunEnv(webpackConfig.devServer.port).then(() => {
   
    startDevServer(webpackConfig)
  })
}

main()
