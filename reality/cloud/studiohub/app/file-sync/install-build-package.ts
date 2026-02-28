import fs from 'fs/promises'
import path from 'path'
import {app} from 'electron'
import log from 'electron-log'

import {makeCodedError} from '../../errors'
import {runInstallCommand} from './run-commands'

const BUILD_PACKAGE_NAME = '8thwall-build.tgz'

const installBuildPackage = async (savePath: string): Promise<void> => {
  try {
    let resourcesPath = ''
    if (!app.isPackaged) {
      resourcesPath = path.resolve(__dirname, '../../build_package')
    } else {
      resourcesPath = process.resourcesPath
    }

    const packageFilePath = path.resolve(resourcesPath, BUILD_PACKAGE_NAME)
    try {
      await fs.access(packageFilePath)
    } catch {
      throw new Error(`Package file not found: ${packageFilePath}`)
    }

    await runInstallCommand(savePath, packageFilePath)
  } catch (error) {
    log.error('error installing build package', error)
    throw makeCodedError('Error installing build package', 500)
  }
}

export {installBuildPackage}
