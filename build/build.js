'use strict'


process.env.NODE_ENV = 'production'

import checkVersions from './check-versions.js'
import {getEnv } from './utils/index.js'
 import   ora from 'ora'
 import   rm  from  'rimraf'
 import   path  from  'path'
 import   chalk  from  'chalk'
 import   webpack  from  'webpack'
 import   config  from  '../config/index.js'
 import   webpackConfig  from  './webpack.prod.conf.js'
checkVersions()

console.log(await getEnv());
const spinner = ora('building for production...')
spinner.start()
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  const config = webpackConfig()
  webpack(config, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
