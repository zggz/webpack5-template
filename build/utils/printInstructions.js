

import address from 'address';
import chalk from 'chalk'



/**
 * 输出 host port
 * @param {*} appName 
 * @param {*} protocol 
 * @param {*} host 
 * @param {*} port 
 * @param {*} useYarn 
 */

export function printInstructions(appName, protocol, host, port, useYarn) {
  console.log();
  console.log(`You can now view ${chalk.bold(appName)} in the browser.`);
  console.log();
  const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
  const lanUrlForConfig = address.ip();
  let prettyHost = host || "localhost";
  console.log(
    `  ${chalk.bold('Local:')}           ${protocol}://${prettyHost}:${port}`
  );
  if (isUnspecifiedHost && lanUrlForConfig && /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(
    lanUrlForConfig
  )) {
    console.log(
      `  ${chalk.bold('On Your Network:')}  ${protocol}://${lanUrlForConfig}:${port}`
    );
  }

  console.log();
  console.log('Note that the development build is not optimized.');
  console.log(
    `To create a production build, use ` +
    `${chalk.cyan(`${useYarn ? 'yarn' : 'npm run'} build`)}.`
  );
  console.log();
}