#!/usr/bin/env node

const chalk = require('chalk');
const semver = require('semver');
const nodeVersion = require('../package.json').engines.node;

function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ));
    process.exit(1);
  }
}

checkNodeVersion(nodeVersion, 'yty-cli');

const program = require('commander');

program
  .version(require('../package').version)
  .option('-i, --init', '初始化项目文件夹')
  .parse(process.argv);

if (program.init) {
  require('../src/init')()
}

program.on('--help', function () {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new project with an official template'))
  console.log('    $ yty-cli --init')
  console.log('    $ yty-cli -i')
  console.log()
})
