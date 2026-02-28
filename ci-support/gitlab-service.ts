import fs from 'fs'
import fetch from 'node-fetch'
import {exec} from 'child_process'
import {promisify} from 'util'

import {doFetch, doPaginatedFetch} from './helpers'

// eslint-disable-next-line max-len
const GITLAB_URL = 'https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/api/v4/projects'

const execPromise = promisify(exec)

interface DownstreamPipeline {
  id: string,
  status: string,
  url: string,
}

const getCredentialsFromSecureStorageForHost = async () => {
  // eslint-disable-next-line max-len
  const res = (await execPromise('git credential-osxkeychain get <<< host=gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com'))
    .stdout.split('\n')
  const password = res[0].replace('password=', '')
  return password
}

const pipelineStatus = async (pat: string, projectId: string, pipelineId: string, remoteBranch: string): Promise<string> => {
  const pipeline = await doFetch(`${GITLAB_URL}/${projectId}/pipelines/${pipelineId}`, {
    headers: {'PRIVATE-TOKEN': pat},
    method: 'get',
  })

  return pipeline.status
}

const getDownstreamPipeline = async (pat: string, projectId: string, pipelineId: string): Promise<DownstreamPipeline | null> => {
  const pipelines = await doFetch(`${GITLAB_URL}/${projectId}/pipelines/${pipelineId}/bridges`, {
    headers: {'PRIVATE-TOKEN': pat},
    method: 'get',
  })
  if (!pipelines?.length || !pipelines[0]?.downstream_pipeline) {
    return null
  }

  return {
    id: pipelines[0].downstream_pipeline.id,
    status: pipelines[0].downstream_pipeline.status,
    url: pipelines[0].downstream_pipeline.web_url,
  }
}

const getJobs = async (pat: string, projectId: string, pipelineId: string): Promise<Array<any>> => await doFetch(`${GITLAB_URL}/${projectId}/pipelines/${pipelineId}/jobs`, {
  headers: {'PRIVATE-TOKEN': pat},
  method: 'get',
})

const postMrComment = async (
  pat: string, projectId: string | number, mergeRequestId: string | number, message: string
) => (
  doFetch(`${GITLAB_URL}/${projectId}/merge_requests/${mergeRequestId}/notes`, {
    headers: {'PRIVATE-TOKEN': pat, 'content-type': 'application/json'},
    method: 'post',
    body: JSON.stringify({body: message}),
  })
)

const getCiContext = () => {
  const token = process.env.NIANTIC_GITLAB_TOKEN || process.env.BUILD_API_TOKEN
  const projectId = process.env.CI_PROJECT_ID
  const mergeRequestId = process.env.CI_MERGE_REQUEST_IID

  if (!token || !projectId || !mergeRequestId) {
    throw new Error('Missing info needed in MR context')
  }

  return {token, projectId, mergeRequestId}
}

const postMrCommentFromCi = async (message: string) => {
  const {token, projectId, mergeRequestId} = getCiContext()
  await postMrComment(token, projectId, mergeRequestId, message)
}

type GitlabNote = {
  id: number
  body: string
  system: boolean
  author: {
    username: string
  }
}

const isComment = (note: GitlabNote) => !note.system

const AUTOMATED_USERNAME = 'buildbot'

const clearAutomatedMrComments = async (
  pat: string, projectId: string | number, mergeRequestId: string | number, match: string
) => {
  if (!match) {
    throw new Error('Match must be specified to avoid deleting all automated comments.')
  }

  const baseUrl = `${GITLAB_URL}/${projectId}/merge_requests/${mergeRequestId}/notes`

  const notes: GitlabNote[] = await doPaginatedFetch<GitlabNote>(baseUrl, {
    headers: {'PRIVATE-TOKEN': pat},
    method: 'get',
  })

  const matchingComments = notes
    .filter(isComment)
    .filter(e => e.author.username === AUTOMATED_USERNAME)
    .filter(e => e.body.includes(match))

  await Promise.all(matchingComments.map(comment => doFetch(`${baseUrl}/${comment.id}`, {
    headers: {'PRIVATE-TOKEN': pat},
    method: 'delete',
  })))
}

const clearAutomatedMrCommentsFromCi = async (match: string) => {
  const {token, projectId, mergeRequestId} = getCiContext()
  await clearAutomatedMrComments(token, projectId, mergeRequestId, match)
}

const downloadArtifact = async (pat: string, projectId: string, jobId: string, artifactPathCi: string, artifactPathLocal: string) => {
  console.log(`Downloading ${artifactPathCi} artifact to ${artifactPathLocal}`)
  if (fs.existsSync(artifactPathLocal)) {
    console.log(`Return early because ${artifactPathCi} already exists at ${artifactPathLocal}`)
    return
  }

  const res = await fetch(`${GITLAB_URL}/${projectId}/jobs/${jobId}/artifacts/${artifactPathCi}`, {
    method: 'get', headers: {'PRIVATE-TOKEN': pat},
  })
  const fileStream = fs.createWriteStream(artifactPathLocal)
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream)
    res.body.on('error', reject)
    fileStream.on('close', resolve)
  })
  console.log(`Finished downloading ${artifactPathCi} artifact to ${artifactPathLocal}`)
}

/* eslint-disable camelcase */
type CreateMrParameters = {
  id: string | number
  source_branch: string
  target_branch: string
  title?: string
  allow_collaboration?: boolean
  approvals_before_merge?: number
  allow_maintainer_to_push?: boolean
  assignee_id?: number
  assignee_ids?: number[]
  description?: string
  labels?: string
  milestone_id?: number
  remove_source_branch?: boolean
  reviewer_ids?: number[]
  squash?: boolean
  squash_on_merge?: boolean
  target_project_id?: boolean
}
/* eslint-enable camelcase */

/**
 * Function for creating a merge request with the gitlab API.
 * See https://docs.gitlab.com/ee/api/merge_requests.html#create-mr
 *
 * @param pat - Project access token. If your script is running on a gitlab runner, you can use the
 * NIANTIC_GITLAB_TOKEN or BUILD_API_TOKEN environment variables for this value
 * @param params - Request parameters for the GitLab Create MR API
 */
const createMr = async (
  pat: string,
  params: CreateMrParameters
) => (
  doFetch(`${GITLAB_URL}/${params.id}/merge_requests`, {
    headers: {'PRIVATE-TOKEN': pat, 'content-type': 'application/json'},
    method: 'post',
    body: JSON.stringify({remove_source_branch: true, squash_on_merge: true, ...params}, null, 2),
  })
)

/**
 * Approves a merge request via the gitlab API. See https://docs.gitlab.com/ee/api/merge_request_approvals.html#approve-merge-request
 * @param pat - Project access token. If your script is running on a gitlab runner, you can use the
 * NIANTIC_GITLAB_TOKEN or BUILD_API_TOKEN environment variables for this value
 * @param projectId - ID of your project in gitlab
 * @param mrId - The merge_request_iid of the MR to be approved
 */
const approveMr = async (
  pat: string,
  projectId: string | number,
  mrId: number
) => {
  const requestBody = {
    id: projectId,
    merge_request_iid: mrId,
  }

  return await doFetch(`${GITLAB_URL}/${projectId}/merge_requests/${mrId}/approve`, {
    headers: {'PRIVATE-TOKEN': pat, 'content-type': 'application/json'},
    method: 'post',
    body: JSON.stringify(requestBody, null, 2),
  })
}

type ListMrsParameters = {
  source_branch?: string
  target_branch?: string
  state?: 'opened' | 'closed' | 'locked' | 'merged'
}

/**
 * Function for listing merge requests from a GitLab project.
 * See https://docs.gitlab.com/ee/api/merge_requests.html#list-project-merge-requests
 *
 * @param pat - Project access token. If your script is running on a gitlab runner, you can use the
 * NIANTIC_GITLAB_TOKEN or BUILD_API_TOKEN environment variables for this value
 * @param projectId - ID of your project in gitlab
 * @param queryParams - Additional paramters used to filter the merge requests returned
 */
const listMrs = async (
  pat: string,
  projectId: string | number,
  queryParams?: ListMrsParameters
) => {
  const fetchOptions = {
    headers: {'PRIVATE-TOKEN': pat, 'content-type': 'application/json'},
    method: 'get',
  }

  if (queryParams) {
    Object.assign(fetchOptions, {queryParams})
  }

  return await doFetch(`${GITLAB_URL}/${projectId}/merge_requests`, fetchOptions)
}

export {
  getCredentialsFromSecureStorageForHost,
  pipelineStatus,
  getDownstreamPipeline,
  getJobs,
  downloadArtifact,
  postMrComment,
  postMrCommentFromCi,
  clearAutomatedMrComments,
  clearAutomatedMrCommentsFromCi,
  createMr,
  approveMr,
  listMrs,
}
