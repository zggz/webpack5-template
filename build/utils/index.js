
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs'
import { readFile } from 'fs/promises';


export { choosePort, isInteractive, clearConsole } from './choosePort.js'

export { printInstructions } from './print.js'

/**
 * 项目根目录
 */
export const appDirectory = fs.realpathSync(process.cwd());

export const resolvePath = (...dir) => path.join(appDirectory, ...dir || "")

export const packageJson = JSON.parse(await readFile(new URL(resolvePath('package.json'), import.meta.url)));

export const getEnv = async (filename) => {
  const REACT_APP = /^REACT_APP_/i;
  let env;
  let lines;
  try {
    env = await readFile(new URL(resolvePath(`env/.env.${filename}`), import.meta.url), { encoding: 'utf-8' })
  } catch (error) {
    env = await readFile(new URL(resolvePath(`env/.env.local`), import.meta.url), { encoding: 'utf-8' })
  }
  lines = env.split(/\r?\n/).map(line => line.split('='))
  return lines.reduce((a, b) => {
    if (b.length === 2 && REACT_APP.test(b[0])) {
      a[`process.env.${b[0].trim()}`] = JSON.stringify(b[1].trim())
    }
    return a
  }, {})
}


// [
//   ['NODE_ENV ', ' development'],
//   ['DEPLOY_ENV ', ' local'],
//   ['sourceMap ', ' source-map'],
//   ['']
// ]

