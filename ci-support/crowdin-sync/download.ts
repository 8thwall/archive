/* eslint-disable no-console */
import * as process from 'process'
import yaml from 'js-yaml'
import {promises as fs} from 'fs'

import {exec, findWorkspace} from '../helpers'
import {getArgs} from '../../c8/cli/args'

import {createPr, listPrs, assignReviewersToPr} from '../github'
import {findCrowdinConfigFiles, runCrowdinDownloadCli} from './crowdin'

const stdout = async (cmd: string) => (await exec(cmd)).stdout.trim()

// TODO(alvinp): Maybe this can be configurable?
const getSourceBranchForConfig = (config: any) => (
  `crowdin-sync-${config.project_id}-translations`
)

const getExistingPr = async (sourceBranch: string, org: string, repo: string) => {
  const queryParams = {
    state: 'open',
    head: `8thwall:${sourceBranch}`,
    base: 'main',
  } as const

  const result = await listPrs(org, repo, queryParams)
  return result[0]
}

const createPrFromCrowdinConfig = async (
  repoRoot: string, configPath: string, org: string, repo: string
) => {
  // Parse the config file to JSON
  const yamlFile = await fs.readFile(configPath, 'utf8')
  const config: any = yaml.load(yamlFile)

  if (!config?.project_id) {
    console.error(`${configPath}: Missing 'project_id' field. Skipping download.`)
    return
  }
  if (!config?.pull_request_title) {
    console.error(`${configPath}: Missing 'pull_request_title' field. Skipping download.`)
    return
  }

  // Reset to main branch
  const sourceBranch = getSourceBranchForConfig(config)
  console.log(await stdout(`git checkout -B ${sourceBranch}`))
  console.log(await stdout('git reset --hard origin/main'))

  // Download the translations from Crowdin
  await runCrowdinDownloadCli(repoRoot, configPath)

  // Commit and push to remote source branch
  try {
    console.log(await stdout('git add . -- \':!venv\''))
    console.log(await stdout(`git commit -m "${config.pull_request_title}"`))
  } catch (e) {
    console.log('No new translations. Skipping merge request')
    return
  }
  // Push to a project-specific remote branch.
  console.log(await stdout(`git push origin ${sourceBranch} --force`))

  let pr

  pr = await getExistingPr(sourceBranch, org, repo)

  if (!pr) {
    // Create pull request
    pr = await createPr({
      owner: org,
      repo,
      title: config.pull_request_title,
      head: sourceBranch,
      base: 'main',
    })
  }

  // Assign reviewers to pull request.
  if (config.pull_request_reviewers.length > 0) {
    await assignReviewersToPr(
      org,
      repo,
      pr.number,
      config.pull_request_reviewers
    )
  }
}

const main = async () => {
  const repoRoot = getArgs()._ordered[0]
  const owner = getArgs()._ordered[1]
  const repo = getArgs()._ordered[2]

  // We're assuming that this is run in a Bazel sandbox, we need to find the workplace for the
  // crowdin-sync workspace again.
  const crowdinSyncWorkspace = findWorkspace(repoRoot)
  process.chdir(crowdinSyncWorkspace)

  if (!repoRoot) {
    throw new Error('Missing repo root argument')
  }

  const {CI_CROWDIN_WRITE_API_KEY} = process.env
  if (!CI_CROWDIN_WRITE_API_KEY) {
    throw new Error('Missing Crowdin API Token environment variable')
  }

  const configFiles = await findCrowdinConfigFiles(repoRoot)

  if (!configFiles.length) {
    throw new Error('No config files found. Exiting.')
  }

  console.log(await stdout('git fetch origin main'))

  // Run Crowdin CLI download command for every config file found, and create a merge request
  // with any new translations downloaded.
  for (let i = 0; i < configFiles.length; ++i) {
    // eslint-disable-next-line no-await-in-loop
    await createPrFromCrowdinConfig(repoRoot, configFiles[i], owner, repo)
  }
}

try {
  main()
} catch (e) {
  console.error(e)
  process.exit(1)
}
