#!/usr/bin/env node
const envCommands = {
  'Console-dev': 'npm run deploy-dev-version',
  'Console-Staging': 'npm run deploy-version',
  'Console-Prod': 'npm run deploy-prod -- Console-prod',
  'Apps-dev': 'npm run deploy-apps-dev-version',
  'Apps-Staging': 'npm run deploy-prod -- Apps-staging',
  'Apps-Prod': 'npm run deploy-prod -- Apps-prod',
  'Apps-Rest': 'npm run deploy-all && npm run deploy-all -- deploy',
}

const inquirer = require('inquirer')
const {spawnSync} = require('child_process')

inquirer
  .prompt([
    {
      name: 'environment',
      type: 'list',
      choices: Object.keys(envCommands),
      message: 'Which environment to deploy?',
      default: 'Console-Staging',
    },
  ])
  .then((answers) => {
    const cmd = envCommands[answers.environment]
    if (!cmd) {
      console.error(`Environment ${answers.environment} not found.`)
      return
    }

    console.log('Running')
    console.log(cmd)
    spawnSync(cmd, [], {stdio: 'inherit', shell: true})

    if (answers.environment === 'Apps-Prod') {
      console.log('After deploying Apps-Prod, you should deploy Apps-Rest to update the rest of the regions.')
    }
  })
