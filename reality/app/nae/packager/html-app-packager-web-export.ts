import path from 'path'
import {promises as fs} from 'fs'

import {streamExec} from '@nia/c8/cli/proc'

/* eslint-disable no-console */
const packageWebBundle = async (
  outputPath: string, assetCachePath: string
) => {
  console.log('Packaging Web Export bundle...')

  const outputDir = path.dirname(outputPath)
  await fs.rm(outputPath, {force: true})
  await fs.mkdir(outputDir, {recursive: true})

  // Change to the asset cache directory and zip contents with relative paths
  await streamExec(`zip -r ${path.resolve(outputPath)} .`, '', {
    cwd: assetCachePath,
    stdio: ['inherit', 'ignore', 'ignore'],
  })

  console.log(`Web Export bundle created at: ${outputPath}`)
  console.log('Success!')
}
/* eslint-enable no-console */

export {
  packageWebBundle,
}
