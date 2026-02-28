/* eslint-disable no-console */
import * as process from 'process'

import {exec} from '../helpers'

const stdout = async (cmd: string) => (await exec(cmd)).stdout.trim()

const CROWDIN_BASE_URL = 'https://<REMOVED_BEFORE_OPEN_SOURCING>.crowdin.com/api/v2'
const CROWDIN_JAR_PATH = 'third_party/crowdin/crowdin-cli.jar'

const getCrowdinJarPath = (repoRoot: string) => `${repoRoot}/${CROWDIN_JAR_PATH}`

const EXCLUDED_CONFIG_DIRECTORIES = [
  '.git/',
  '.gitlab/',
  'third_party/',
  'bazel-niantic/',
  'bzl/',
  '**/node_modules/*',
]

const findCrowdinConfigFiles = async (repoRoot: string): Promise<string[]> => {
  // Don't use configuration files found in the following directories.
  const excludedDirs = EXCLUDED_CONFIG_DIRECTORIES.map(
    dir => `! -path '${repoRoot}/${dir}'`
  ).join(' ')

  console.log('Finding config files ...')
  const configFiles = (
    await stdout(`find ${repoRoot}/reality/cloud -name 'crowdin.*.yml' ${excludedDirs}`)
  ).split('\n')

  return configFiles
}

const runCrowdinUploadCli = async (repoRoot: string, configPath: string) => {
  const basePathRegex = new RegExp(`^${repoRoot}`)
  const relativeConfig = configPath.replace(basePathRegex, '')
  try {
    console.log(`Uploading ☁️  (${relativeConfig})`)
    console.log(await stdout(
      `java -jar ${getCrowdinJarPath(repoRoot)} upload sources ` +
      `--token ${process.env.CI_CROWDIN_WRITE_API_KEY} ` +
      `--base-url ${CROWDIN_BASE_URL} ` +
      `--config ${configPath} ` +
      '--delete-obsolete'
    ))
    console.log(`Success ✅ (${relativeConfig})`)
  } catch (e) {
    console.error(e)
    console.error(`Failed ❌ (${relativeConfig})`)
  }
}

const runCrowdinDownloadCli = async (repoRoot: string, configPath: string) => {
  const basePathRegex = new RegExp(`^${repoRoot}`)
  const relativeConfig = configPath.replace(basePathRegex, '')
  try {
    console.log(`Downloading ☁️  (${relativeConfig})`)
    console.log(await stdout(
      `java -jar ${getCrowdinJarPath(repoRoot)} download ` +
      `--token ${process.env.CI_CROWDIN_WRITE_API_KEY} ` +
      `--base-url ${CROWDIN_BASE_URL} ` +
      `--config ${configPath}`
    ))
    console.log(`Success ✅ (${relativeConfig})`)
  } catch (e) {
    console.error(e)
    console.error(`Failed ❌ (${relativeConfig})`)
  }
}

export {
  findCrowdinConfigFiles,
  runCrowdinUploadCli,
  runCrowdinDownloadCli,
}
