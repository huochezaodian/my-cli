const fs = require('fs')
const fse = require('fse')
const path = require('path')
const os = require('os')
const download = require('download-git-repo')

module.exports = async function fetchRemoteTemplate () {
  const tmpdir = path.join(os.tmpdir(), 'yty-cli')

  if (fs.existsSync(tmpdir)) {
    await fse.remove(tmpdir)
  }

  await new Promise((resolve, reject) => {
    download('huochezaodian/cli-templete', tmpdir, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports = async function copyTemplate (templateName, targetDir) {
  const tmpdir = path.join(os.tmpdir(), 'yty-cli')

  await fse.copy(path.join(tmpdir, templateName, '/*.*'), targetDir)

  await fse.remove(tmpdir)
}
