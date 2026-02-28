const {basename, dirname} = require('path')

const parseConfigPath = (configPath) => {
  // configPath is like: reality/cloud/xrhome/.elasticbeanstalk/Console-prod-us-west-2.cfg.yml
  const fileName = basename(configPath)
  const configName = fileName.split('.')[0]             // Console-prod-us-west-2
  const nameSplit = configName.split('-')
  const environment = nameSplit.slice(0, -3).join('-')  // Console-prod
  const region = nameSplit.slice(-3).join('-')          // us-west-2
  const ebDir = dirname(configPath)                     // reality/cloud/xrhome/.elasticbeanstalk
  const mainDir = dirname(ebDir)                        // reality/cloud/xrhome

  return {
    configName,
    environment,
    region,
    ebDir,
    mainDir,
  }
}

module.exports = {
  parseConfigPath,
}
