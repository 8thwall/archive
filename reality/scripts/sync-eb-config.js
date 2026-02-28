#!/usr/local/bin/node

// Updates local cfg.yml file(s) to match current EB config
// Usage: ./scripts/sync-eb-config.js
//    or: ./scripts/sync-eb-config.js path/to/file.cfg.yml

const {exec: execNode} = require('child_process')
const {join} = require('path')
const {promises: {readFile, writeFile, unlink: deleteFile}} = require('fs')
const yamlParser = require('js-yaml')

const {parseConfigPath} = require('./lib/parse-eb-config-path')

const root = join(__dirname, '..')

const PRESERVE_DATES = true

const removeQuotesFromKeys = text => text.replace(/(^|\n)(\s*)'([^\s]+)':/g, '$1$2$3:')

const execAsync = (command, opts = {}) => new Promise((resolve, reject) => {
  execNode(command, {cwd: root, ...opts}, (err, stdout) => {
    if (err) {
      reject(err)
    }
    resolve(stdout.toString())
  })
})

const syncEbConfig = async (configPath) => {
  // configPath is like: reality/cloud/xrhome/.elasticbeanstalk/Console-prod-us-west-2.cfg.yml
  const {configName, environment, region, ebDir, mainDir} = parseConfigPath(configPath)

  // To export the current state of the EB environment, we have to create a temporary snapshot,
  // update the current config with its data, then delete the snapshot from EB
  const snapshot = `temp_${Date.now()}_${configName}`

  // eslint-disable-next-line no-console
  console.log(`Syncing ${configName}`)

  await execAsync(`eb config save ${environment} -r ${region} --cfg ${snapshot}`, {cwd: mainDir})

  const snapshotPath = `${ebDir}/saved_configs/${snapshot}.cfg.yml`

  const updatedConfig = yamlParser.safeLoad(await readFile(snapshotPath, 'utf-8'))

  // The date properties change with every export so this flag keeps them from changing on disk
  if (PRESERVE_DATES) {
    const currentConfig = yamlParser.safeLoad(await readFile(configPath, 'utf-8'))

    const {DateCreated, DateModified} = currentConfig.EnvironmentConfigurationMetadata

    Object.assign(updatedConfig.EnvironmentConfigurationMetadata, {
      DateCreated,
      DateModified,
    })
  }

  const finalString = removeQuotesFromKeys(yamlParser.safeDump(updatedConfig, {
    sortKeys: true,
    lineWidth: 500,
  }))

  await writeFile(configPath, finalString)

  await deleteFile(snapshotPath)

  await execAsync(`eb config delete ${snapshot}`, {cwd: mainDir})
}

const listTrackedConfigs = async () => {
  const command = [
    'git ls-tree -r HEAD --name-only ',                // List files checked into source control
    'grep -E "/\\.elasticbeanstalk/.*\\.cfg\\.yml$"',  // Limit to files that look like EB configs
  ].join(' | ')

  return (await execAsync(command)).split('\n').filter(Boolean)
}

const run = async (argFiles) => {
  const configPaths = argFiles.length ? argFiles : await listTrackedConfigs()

  for (let i = 0; i < configPaths.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await syncEbConfig(configPaths[i])
  }
}

run(process.argv.slice(2))
