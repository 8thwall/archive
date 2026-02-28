import AWS from 'aws-sdk'
import fs from 'fs'
import {promisify} from 'util'

import {parseRepoId} from '../../src/shared/repo-id'
import {DB_ENV, fetchAppsFromPostgres} from './db'

/* eslint-disable no-console */

const codecommit = new AWS.CodeCommit({region: 'us-west-2'})

interface ListParams {
  nextToken?: string
}

type RepoData = {
  names: string[]
  nameSet: Set<string>
}

// If true, always load fresh data instead of reusing locally cached data
const FRESH_OVERRIDE = true

const LOAD_FRESH_REPOS = FRESH_OVERRIDE || false
const LOAD_FRESH_APPS = FRESH_OVERRIDE || false

const repoLoc = `${__dirname}/repos.json`
const appsLoc = `${__dirname}/apps-${DB_ENV}.json`

const loadRepoNames = async (nextToken: string, result: string[]): Promise<string[]> => {
  const listParams :ListParams = { }

  if (nextToken) {
    listParams.nextToken = nextToken
  }

  const repositoryList = await codecommit.listRepositories(listParams).promise()

  const nameList = repositoryList.repositories
    .map(i => i.repositoryName)
    .filter(i => !i.startsWith('deleted-'))

  result.push(...nameList)

  if (repositoryList.nextToken) {
    return loadRepoNames(repositoryList.nextToken, result)
  } else {
    return result
  }
}

const fetchRepos = async (): Promise<RepoData> => {
  let names: string[]
  if (LOAD_FRESH_REPOS) {
    console.warn('loading fresh repos')
    names = await loadRepoNames(null, [])
    await promisify(fs.writeFile)(repoLoc, JSON.stringify(names, null, 2))
    console.warn('done loading repos')
  } else {
    names = JSON.parse(await promisify(fs.readFile)(repoLoc, 'utf8'))
  }
  return {names, nameSet: new Set(names)}
}

interface AppResult {
  uuid: string
  appKey: string
  appName: string
  repoId: string
  repoStatus: 'NONE' | 'PRIVATE' | 'PUBLIC'
  Account: {shortName: string}
}

const fetchApps = async (): Promise<AppResult[]> => {
  let apps: AppResult[]

  if (LOAD_FRESH_APPS) {
    console.warn('loading fresh apps')
    apps = await fetchAppsFromPostgres() as AppResult[]
    await promisify(fs.writeFile)(appsLoc, JSON.stringify(apps, null, 2))
    console.warn('done loading apps')
  } else {
    apps = JSON.parse(await promisify(fs.readFile)(appsLoc, 'utf8'))
  }

  return apps
}

const checkDiscrepancies = async () => {
  const [apps, repoData] = await Promise.all([
    fetchApps(),
    fetchRepos(),
  ])

  console.warn('Got apps:', apps.length, 'repos:', repoData.names.length)

  const appsByUuid = apps.reduce((acc, e) => {
    acc[e.uuid] = e
    return acc
  }, {} as Record<string, AppResult>)

  const specToUuid = apps.reduce((acc, e) => {
    acc[`${e.Account.shortName}.${e.appName}`] = e.uuid
    return acc
  }, {})

  const repoIdRepeats = new Set<string>()

  const repoIdToUuid = apps.reduce((acc, e) => {
    if (e.repoId) {
      if (acc[e.repoId]) {
        repoIdRepeats.add(e.repoId)
      } else {
        acc[e.repoId] = e.uuid
      }
    }
    return acc
  }, {} as Record<string, string>)

  const appsWithMissingRepoId = [] as {uuid: string, repoId: string}[]
  const appsWithMismatchedRepoId = [] as {uuid: string, current: string, repoId: string}[]
  const appsWithInvalidRepoId = [] as {uuid: string, repoId: string}[]
  const appsWithNonexistentRepo = [] as {uuid: string, projectSpecifier: string, repoId: string}[]
  const invalidRepoId = [] as string[]
  const noMatchingAppForRepoId = [] as string[]
  const newFormatMissingApp = [] as string[]
  const validatedRepoIds = [] as string[]
  const reposMissingRepoStatus = [] as string[]

  const processRepoIdWithApp = (repoId: string, app: AppResult) => {
    if (!['PRIVATE', 'PUBLIC'].includes(app.repoStatus)) {
      reposMissingRepoStatus.push(repoId)
    } else if (app.repoId === repoId) {
      validatedRepoIds.push(repoId)
    } else if (app.repoId) {
      appsWithMismatchedRepoId.push({uuid: app.uuid, current: app.repoId, repoId})
    } else {
      appsWithMissingRepoId.push({uuid: app.uuid, repoId})
    }
  }

  const processLegacyRepoId = (repoId: string) => {
    const app = appsByUuid[specToUuid[repoId]]
    if (app) {
      processRepoIdWithApp(repoId, app)
    } else {
      noMatchingAppForRepoId.push(repoId)
    }
  }

  const processLatestRepoId = (repoId: string) => {
    const app = appsByUuid[repoIdToUuid[repoId]]
    if (app) {
      processRepoIdWithApp(repoId, app)
    } else {
      newFormatMissingApp.push(repoId)
    }
  }

  const processRepoId = (repoId: string) => {
    try {
      const parsed = parseRepoId(repoId)
      if (parsed.isLegacyFormat) {
        processLegacyRepoId(repoId)
      } else {
        processLatestRepoId(repoId)
      }
    } catch (err) {
      invalidRepoId.push(repoId)
    }
  }

  const processApp = (app: AppResult) => {
    const hasStatus = ['PRIVATE', 'PUBLIC'].includes(app.repoStatus)
    if (!hasStatus) {
      return
    }

    const projectSpecifier = `${app.Account.shortName}.${app.appName}`

    if (!app.repoId) {
      if (!repoData.nameSet.has(projectSpecifier)) {
        appsWithNonexistentRepo.push({uuid: app.uuid, projectSpecifier, repoId: app.repoId})
      }
      return
    }

    try {
      const parsed = parseRepoId(app.repoId)
      if (!parsed.isLegacyFormat) {
        // Since we're only loading partition 0 repos,
        return
      }
    } catch (err) {
      appsWithInvalidRepoId.push({uuid: app.uuid, repoId: app.repoId})
    }

    if (!repoData.nameSet.has(app.repoId)) {
      appsWithNonexistentRepo.push({uuid: app.uuid, projectSpecifier, repoId: app.repoId})
    }
  }

  apps.forEach((app) => {
    processApp(app)
  })

  repoData.names.forEach((repoId) => {
    processRepoId(repoId)
  })

  return {
    appsWithMissingRepoId,
    appsWithMismatchedRepoId,
    appsWithInvalidRepoId,
    appsWithNonexistentRepo,
    invalidRepoId,
    noMatchingAppForRepoId,
    newFormatMissingApp,
    validatedRepoIds,
    reposMissingRepoStatus,
  }
}

export {
  checkDiscrepancies,
}
