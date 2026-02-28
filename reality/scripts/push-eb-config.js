#!/usr/bin/env node

// Push local cfg.yml file to EB
// Usage: ./scripts/push-eb-config.js path/to/file.cfg.yml

const {exec: execNode} = require('child_process')
const {promises: {access}} = require('fs')
const {basename} = require('path')
const readline = require('readline')
const {promisify} = require('util')

const {parseConfigPath} = require('./lib/parse-eb-config-path')

const execAsync = promisify(execNode)

const confirm = prompt => new Promise((resolve) => {
  const interface = readline.createInterface(process.stdin, process.stdout)
  interface.question(`${prompt} (y/N) `, (answer) => {
    interface.close()
    if (answer === 'y') {
      resolve(true)
    } else {
      resolve(false)
    }
  })
})

const pushEbConfig = async (configPath) => {
  const {configName, environment, region, mainDir} = parseConfigPath(configPath)

  // eslint-disable-next-line no-console
  console.log(`Deploying ${configName}`)

  await execAsync(`eb config ${environment} -r ${region} --cfg ${configName}`, {cwd: mainDir})
}

const run = async (filePath, ...rest) => {
  if (!filePath) {
    // eslint-disable-next-line no-console
    console.error('Missing file argument')
    process.exit(1)
  }

  if (rest.length) {
    // eslint-disable-next-line no-console
    console.error('Expected single config at a time')
    process.exit(1)
  }

  try {
    await access(filePath)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Inaccessible file: ${filePath}`)
    process.exit(1)
  }

  if (await confirm(`Are you sure you want to push config for: ${basename(filePath)}?`)) {
    await pushEbConfig(filePath)
  } else {
    // eslint-disable-next-line no-console
    console.log('Cancelled')
  }
}

run(...process.argv.slice(2))
