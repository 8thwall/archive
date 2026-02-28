import fetch, {Response, RequestInit} from 'node-fetch'
import {URLSearchParams} from 'url'
import fs from 'fs'
import {exec} from 'child_process'
import {promisify} from 'util'

const execPromise = promisify(exec)

const makeDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true})
  }
}

type FetchOptions = RequestInit & {
  queryParams?: Record<string, string>
}

const responseToJsonOrText = (res: Response) => {
  const contentType = res.headers.get('Content-Type')
  const isJsonResponse = contentType && contentType.indexOf('json') > 0
  if (!res.ok) {
    const msg = isJsonResponse ? res.json().then(({message}) => message) : res.clone().text()
    return msg.then((message) => {
      console.error('Error', res.status, message)
      throw new Error(message)
    })
  }
  if (isJsonResponse) {
    return res.json()
  }
  return res.text()
}

const doFetch = async (
  url: string,
  options: FetchOptions = {}
) => {
  const {queryParams, ...fetchOptions} = options
  const uri = `${url}?${new URLSearchParams(queryParams)}`
  const res = await fetch(uri, fetchOptions)
  return responseToJsonOrText(res)
}

const doPaginatedFetch = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<T[]> => {
  const {queryParams, ...fetchOptions} = options
  let nextPageUrl: string | null | undefined = `${url}?${new URLSearchParams(queryParams)}`

  let iterations = 0
  const results: T[] = []
  while (nextPageUrl && iterations++ < 100) {
    // eslint-disable-next-line no-await-in-loop
    const res: Response = await fetch(nextPageUrl, fetchOptions)
    // eslint-disable-next-line no-await-in-loop
    const data = await responseToJsonOrText(res)
    if (!Array.isArray(data)) {
      throw new Error('Expected an array response in doPaginatedFetch')
    }
    results.push(...data)
    // https://docs.gitlab.com/ee/api/rest/index.html#pagination-link-header
    const nextLink = res.headers.get('link')?.split(',').find(link => link.includes('rel="next"'))
    nextPageUrl = nextLink?.split(';')[0].trim().slice(1, -1)
  }
  return results
}

const getRemoteBranch = async (directory: string): Promise<string> => {
  // eslint-disable-next-line max-len
  const fullBranch = await execPromise(`cd ${directory} &&  git rev-parse --abbrev-ref --symbolic-full-name @{u}`)
  return fullBranch.stdout.split('/').pop()?.trim() || ''
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Utility to find the bazel workspace root as a parent of the current directory by recursive
// search.
const findWorkspace = (dirname: string) => {
  if (!dirname) {
    throw new Error('Couldn\'t find WORKSPACE root.')
  }
  const contents = fs.readdirSync(dirname)
  if (contents.find(v => v === 'WORKSPACE')) {
    return dirname
  }
  const path = dirname.split('/')
  const parent = path.slice(0, path.length - 1).join('/')
  return findWorkspace(parent)
}

export {
  makeDir,
  doFetch,
  doPaginatedFetch,
  sleep,
  getRemoteBranch,
  findWorkspace,
  execPromise as exec,
}
