import detect from 'detect-port-alt'
import chalk from 'chalk'
import prompts from 'prompts'

const isRoot = () => process.getuid && process.getuid() === 0;

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
export const isInteractive = process.stdout.isTTY;

export function clearConsole() {
  // process.stdout.write(
  //   process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  // );
  return null
}

export function choosePort(host, defaultPort = DEFAULT_PORT) {
  return detect(defaultPort, host).then(
    port =>
      new Promise(resolve => {
        if (port === defaultPort) {
          return resolve(port);
        }
        const message =
          process.platform !== 'win32' && defaultPort < 1024 && !isRoot()
            ? `Admin permissions are required to run a server on a port below 1024.`
            : `Something is already running on port ${defaultPort}.`;
        if (isInteractive) {
          clearConsole();
          const question = {
            type: 'confirm',
            name: 'shouldChangePort',
            message:
              chalk.yellow(message) + '\n\nWould you like to run the app on another port instead?',
            initial: true,
          };
          prompts(question).then(answer => {
            if (answer.shouldChangePort) {
              resolve(port);
            } else {
              resolve(null);
            }
          });
        } else {
          console.log(chalk.red(message));
          resolve(null);
        }
      }),
    err => {
      throw new Error(
        chalk.red(`Could not find an open port at ${chalk.bold(host)}.`) +
        '\n' +
        ('Network error message: ' + err.message || err) +
        '\n'
      );
    }
  );
}
