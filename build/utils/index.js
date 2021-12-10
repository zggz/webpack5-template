
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs'
import { readFile } from 'fs/promises';


export { choosePort, isInteractive, clearConsole } from './choosePort.js'

export { printInstructions } from './printInstructions.js'
export const transformArrayToObject = (arr, regexp = new RegExp()) => arr.reduce((a, b) => {
  if (b.includes('=') && regexp.test(b)) {
    let line = b.split('=')
    a[`${line[0].trim()}`] = JSON.stringify(line[1].trim())
  }
  return a
}, {})

/**
 * 项目根目录
 */
export const appDirectory = fs.realpathSync(process.cwd());

export const resolvePath = (...dir) => path.join(appDirectory, ...dir || "")

export const packageJson = JSON.parse(await readFile(new URL(resolvePath('package.json'), import.meta.url)));

export const getEnv = async (filename) => {
  const REACT_APP = /^REACT_APP_/i;
  let env;
  try {
    env = await readFile(new URL(resolvePath(`env/.env.${filename}`), import.meta.url), { encoding: 'utf-8' })
  } catch (error) {
    env = await readFile(new URL(resolvePath(`env/.env.local`), import.meta.url), { encoding: 'utf-8' })
  }

  return transformArrayToObject(env.split(/\r?\n/), REACT_APP )
}


/**
 * 注入命令行工具
 */
export const initArguments = () => {
  process.argv.slice(2).reduce((a, b) => {
    if (b.includes('=')) {
      let line = b.split('=')
      a[`${line[0].trim()}`] = line[1].trim()
    }
    return a
  }, process.env)
}


