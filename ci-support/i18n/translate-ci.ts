// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)
//
// This is a wrapper script that figures out what changed since the previous commit, and then passes
// those files, along with the arguments to this script, along to the `translate` script.

import * as child_process from 'child_process'  // eslint-disable-line camelcase
import * as process from 'process'
import {promisify} from 'util'
import {createMr} from 'ci-support/gitlab-service'

const exec = promisify(child_process.exec)
const stdout = async (cmd) => (await exec(cmd)).stdout.trim()

const main = async () => {
  // Get relevant CI data from gitlab.
  const {CI_COMMIT_SHA, CI_COMMIT_BEFORE_SHA, CI_COMMIT_BRANCH} = process.env
  if (!(CI_COMMIT_BEFORE_SHA && CI_COMMIT_SHA)) {
    throw new Error('Missing Gitlab CI environment variables')
  }

  // This can happen if a job is accidentally triggered from a non-push pipeline, e.g. a scheduled
  // pipeline. These pipelines should be excluded by the yml job, but in case there is some error
  // in upstream configuration, we want to be defensive here and not cause lots of scheduled
  // pipelines to alert.
  console.log(`CI_COMMIT_BRANCH: ${process.env.CI_COMMIT_BRANCH}`)
  console.log(`CI_PIPELINE_SOURCE: ${process.env.CI_PIPELINE_SOURCE}`)
  if (CI_COMMIT_BEFORE_SHA === '0000000000000000000000000000000000000000') {
    console.warn(`Invalid CI_COMMIT_BEFORE_SHA ${CI_COMMIT_BEFORE_SHA}, not running translation`)
    return
  }

  // Print the work we will be doing.
  console.log(`Getting file delta from ${CI_COMMIT_BEFORE_SHA} to ${CI_COMMIT_SHA}`)

  // Fetch enough data to do analysis.
  console.log(`Fetching git changes through ${CI_COMMIT_BEFORE_SHA}`)
  await exec(`git fetch origin ${CI_COMMIT_BEFORE_SHA}`)

  const baseDirArg = '--base-directory-source='
  const subtree = process.argv.find(arg => arg.startsWith(baseDirArg)).substring(baseDirArg.length)

  // Compute sets of files that changed.
  console.log(`Computing diff-tree within ${subtree}`)
  // TODO: this fails if the CI_COMMIT_BEFORE_SHA is 0000000000000000000000000000000000000000, which it is when running on a newly created branch.
  // May not be much of an issue in practice, depending on how the job rules are set up.
  const diffTree = await stdout(
    `git diff-tree --no-commit-id --name-status -r ${CI_COMMIT_BEFORE_SHA} ${CI_COMMIT_SHA} ${subtree}`
  )
  console.log(diffTree)

  // Organize the diffs by operation type (e.g. A/M/D)
  const diffs: Record<string, string[]> = diffTree.split('\n').reduce((out, line) => {
    const [op, file] = line.split('\t')
    console.log(`Split line '${line}' to '${op}' and '${file}'`)
    if (out[op]) {
      out[op].push(file)
    } else {
      out[op] = [file]
    }
    return out
  }, {})

  console.log('Computed diffs:', diffs)

  const repoRoot = await stdout('bazel info workspace')
  // argv[0] is node, argv[1] is this script, argv[2..n] are what we want to pass to the child
  // script.
  const translateArgs = process.argv.slice(2)

  delete process.env.RUNFILES_DIR

  await Promise.all(Object.entries(diffs).map(async ([op, files]) => {
    switch (op) {
      case 'A':
      case 'M':
        const sourcesArg = `--sources=${files.join(',')}`
        const args = [...translateArgs, sourcesArg].join(' ')
        const cmd = `${repoRoot}/ci-support/i18n/translate ${args}`
        console.log(`Running cmd`, cmd)
        const result = await stdout(cmd)
        console.log(result)
        return result
      case 'D':
        console.warn('Deletes are not yet supported')
        break
      default:
        throw new Error(`Unhandled git operation '${op}'`)
    }
  }))

  // Commit the changed files

  // TODO: This logic commits the changes back to the source branch. Should decide on a branch name generation scheme, or else how to make it
  // configurable to the user, before merging this to main.
  const destBranch = `${CI_COMMIT_BRANCH}-${CI_COMMIT_SHA}-translated`
  console.log(`Switching to branch ${destBranch}`)
  console.log(`git switch -c "${destBranch}"`)
  console.log(await stdout(`git switch -c "${destBranch}"`))
  console.log('git status')
  console.log(await stdout(`git status`))
  const baseOutputArg = '--base-directory-output='
  const outputDir = process.argv.find(arg => arg.startsWith(baseOutputArg)).substring(baseOutputArg.length)
  console.log(`git add ${outputDir}/**`)
  console.log(await stdout(`git add ${outputDir}/**`))
  console.log('git status')
  console.log(await stdout(`git status`))
  console.log(`git commit --all -m "Including auto-translated files."`)
  console.log(await stdout(`git commit --all -m "Including auto-translated files."`))
  console.log('git status')
  console.log(await stdout(`git status`))
  console.log(`git diff ${CI_COMMIT_SHA} HEAD`)
  console.log(await stdout(`git diff ${CI_COMMIT_SHA} HEAD`))
  console.log('git log')
  console.log(await stdout(`git log`))
  console.log('git remote -v')
  console.log(await stdout('git remote -v'))
  console.log(`git push --set-upstream origin_ssh "${destBranch}"`)
  console.log(await stdout(`git push --set-upstream origin_ssh "${destBranch}"`))

  console.log('Creating a new MR on gitlab')
  const token = process.env.NIANTIC_GITLAB_TOKEN || process.env.BUILD_API_TOKEN
  const params = {
    id: process.env.CI_PROJECT_ID,
    source_branch: destBranch,
    target_branch: 'main',
    title: '[i18n] Auto-translated output',
    description: 'Including auto-translated files.',
    remove_source_branch: true,
    squash_on_merge: true,
  }
  const createMrResult = await createMr(token, params)
  console.log('Created MR at: ', createMrResult.web_url)

  // TODO: Fetch info about the source MR / author. Assign the author as a reviewer for the new MR
  // and ping the source MR with the new WebURL.
}

try {
  main()
} catch (e) {
  console.error(e)
  process.exit(1)
}
