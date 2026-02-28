/* eslint-disable no-console */
import * as process from 'process'

import {getArgs} from '../../c8/cli/args'

import {
  findCrowdinConfigFiles,
  runCrowdinUploadCli,
} from './crowdin'

const main = async () => {
  const repoRoot = getArgs()._ordered[0]
  if (!repoRoot) {
    throw new Error('Missing repo root argument')
  }

  const {CI_CROWDIN_WRITE_API_KEY} = process.env
  if (!CI_CROWDIN_WRITE_API_KEY) {
    throw new Error('Missing Crowdin API Token environment variable')
  }

  const configFiles = await findCrowdinConfigFiles(repoRoot)
  console.log('Config files found:', configFiles)
  // Run Crowdin CLI upload command for every config file found.
  for (let i = 0; i < configFiles.length; ++i) {
    // eslint-disable-next-line no-await-in-loop
    await runCrowdinUploadCli(repoRoot, configFiles[i])
  }
}

try {
  main()
} catch (e) {
  console.error(e)
  process.exit(1)
}
