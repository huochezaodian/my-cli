const { logWithSpinner, stopSpinner } = require('../src/util/spinner')
const { error, clearConsole, log } = require('../src/util/logger')
const fetchRemoteTemplate = require('../src/util/loadFile')
const copyTemplate = require('../src/util/loadFile')
const path = require('path')
const inquirer = require('inquirer')
const validateProjectName = require('validate-npm-package-name')
const fs = require('fs')
const fse = require('fse')
const child_process = require('child_process')

async function init () {
  const { project } = await inquirer.propmt([
    {
      name: 'project',
      message: 'please enter the project name',
      default: 'my-project'
    }
  ])
  const { tpl } = await inquirer.propmt([
    {
      name: 'tpl',
      type: 'list',
      message: 'please select a project template',
      choices: [
        { name: 'gulp-simple', value: 'gulp-simple' },
        { name: 'vue-webpack', value: 'vue-webpack' },
        { name: 'react-webpack', value: 'react-webpack' }
      ]
    }
  ])
  const cwd = process.cwd()
  const targetDir = path.resolve(cwd, project)

  const result = validateProjectName(project)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${project}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red(err))
    })
    process.exit(1)
  }

  if (fs.existsSync(targetDir)) {
    const { ok } = await inquirer.prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: `${project} already exists. Are you sure to cover it?`
      }
    ])
    if (!ok) {
      return
    } else {
      await fse.remove(targetDir)
      await fse.mkdir(targetDir)
    }
  }

  await clearConsole()

  logWithSpinner('🚀', 'download remote templete ...')
  await fetchRemoteTemplate()
  stopSpinner('🚀', 'download success.')

  logWithSpinner('📄', 'create project ...')
  await copyTemplate(tpl, targetDir)
  stopSpinner('📄', 'create success.')
  log('next install lib ...')

  await child_process.execSync('cd' + tpl + '&&' + 'npm install')
  log('install success.')

  process.exit(1)
}

module.exports = () => {
  return init().catch(err => {
    stopSpinner(false)
    error(err)
    process.exit(1)
  })
}
