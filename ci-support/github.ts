/* eslint-disable no-console */
import * as process from 'process'

import {doFetch} from './helpers'

const GITHUB_URL = 'https://api.github.com'
const DEFAULT_PAGE = 1

type CreatePrParameters = {
  owner: string
  repo: string
  title?: string
  head: string
  base: string
  body?: string
}

type ListPrParameters = {
  state: 'open' | 'closed' | 'all'
  head?: string
  base?: string
  page?: number
}

const createPr = async (params: CreatePrParameters) => {
  console.log('Creating PR with params:', params)
  const response = await doFetch(`${GITHUB_URL}/repos/${params.owner}/${params.repo}/pulls`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.text+json',
    },
    method: 'POST',
    body: JSON.stringify({
      ...params,
      maintainer_can_modify: true,
    }),
  })
  return response
}

const listPrs = async (
  owner: string,
  repo: string,
  params: ListPrParameters
) => {
  const response = await doFetch(`${GITHUB_URL}/repos/${owner}/${repo}/pulls`, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.text+json',
    },
    method: 'GET',
    queryParams: {
      ...params,
      page: (params.page || DEFAULT_PAGE),
    },
  })
  return response
}

const assignReviewersToPr = async (
  owner: string, repo: string, prNumber: number, reviewers: string[]
) => {
  if (reviewers.length === 0) {
    console.error('No reviewers to assign')
    return null
  }

  const response = await doFetch(
    `${GITHUB_URL}/repos/${owner}/${repo}/pulls/${prNumber}/requested_reviewers`,
    {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.text+json',
      },
      method: 'POST',
      body: JSON.stringify({
        reviewers,
      }),
    }
  )
  return response
}

export {
  createPr,
  listPrs,
  assignReviewersToPr,
}
