import {dialog, shell, app} from 'electron'
import os from 'os'
import path from 'path'
import fs from 'fs/promises'
import log from 'electron-log'

import {makeRunQueue} from '@nia/reality/shared/run-queue'

import {
  InitializeProjectParams, MoveProjectParams, ProjectRequestParams,
} from './project-handler-types'
import {
  upsertLocalProject, getLocalProject, markLocalProjectInitialized,
  getLocalProjects, deleteLocalProject as deleteLocalProjectEntry,
} from '../../local-project-db'
import {makeCodedError, withErrorHandlingResponse} from '../../errors'
import {
  PROJECT_INIT_PATH, PROJECT_LIST_PATH, PROJECT_DELETE_PATH, PROJECT_REVEAL_IN_FINDER_PATH,
  PROJECT_STATUS_PATH, PROJECT_WATCH_PATH,
  PROJECT_PICK_NEW_LOCATION_PATH,
  PROJECT_MOVE_PATH,
  PROJECT_OPEN_PATH,
} from './paths'
import {makeJsonResponse} from '../../json-response'
import {getQueryParams} from '../../query-params'
import {projectSetup} from './create-project-files'
import {getProjectSrcPath} from '../../project-helpers'
import {createLocalServer, LocalServer} from '../../local-server'
import {openInCodeEditor} from '../preferences/code-editor'

const locationPrompt = async (): Promise<string | undefined> => {
  const res = await dialog.showOpenDialog({properties: ['openDirectory']})
  return res.canceled ? undefined : res.filePaths[0]
}

const localServerRunQueue = makeRunQueue()
const appKeyToLocalServerManager: Map<string, LocalServer> = new Map()

const getLocalProjectLocation = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = InitializeProjectParams.safeParse(getQueryParams(requestUrl))

  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  if (!params.data.appKey) {
    throw makeCodedError('Missing appKey', 400)
  }

  const projectEntry = getLocalProject(params.data.appKey)
  if (projectEntry?.location) {
    return makeJsonResponse({
      projectPath: projectEntry.location,
      initialization: projectEntry.initialization,
    })
  }

  let savePath: string | undefined

  if (params.data.location) {
    savePath = params.data.location
  } else if (params.data.appName) {
    savePath = path.join(os.homedir(), 'Documents', app.getName(), params.data.appName)
  } else {
    savePath = await locationPrompt()
  }

  if (!savePath) {
    throw makeCodedError('Failed to retrieve location to save', 404)
  }

  let exists = false
  try {
    await fs.access(savePath)
    exists = true
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw makeCodedError(`Failed to access path: ${savePath}`, 500)
    }
  }

  if (exists) {
    const contents = await fs.readdir(savePath)
    if (contents.length > 0) {
      throw makeCodedError(`The provided path already exists and is not empty: ${savePath}`, 409)
    }
  }

  await fs.mkdir(path.join(savePath, 'src', 'assets'), {recursive: true})

  await projectSetup(savePath)

  upsertLocalProject(params.data.appKey, savePath)
  return makeJsonResponse({projectPath: savePath, initialization: 'needs-initialization'})
})

const startWatch = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = ProjectRequestParams.safeParse(getQueryParams(requestUrl))

  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  const {appKey} = params.data
  if (!appKey) {
    throw makeCodedError('Missing appKey', 400)
  }

  const projectEntry = getLocalProject(appKey)
  if (!projectEntry) {
    throw makeCodedError('Project for appKey not found', 404)
  }

  return localServerRunQueue.next(async () => {
    const serverManager = appKeyToLocalServerManager.get(appKey)

    if (serverManager) {
      const isRunning = await serverManager.checkRunning()
      if (isRunning) {
        return makeJsonResponse({})
      } else {
        serverManager.stop()
      }
    }

    try {
      const newManager = await createLocalServer(projectEntry.location)
      appKeyToLocalServerManager.set(appKey, newManager)
      const running = await newManager.checkRunning()
      if (!running) {
        throw new Error('Failed to start local server')
      }
      return makeJsonResponse({})
    } catch (error: any) {
      log.info(`Error starting local server: ${error}`)
      throw makeCodedError(`Failed to start watch server: ${error.message}`, 500)
    }
  })
})

const stopWatch = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = ProjectRequestParams.safeParse(getQueryParams(requestUrl))

  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  if (!params.data.appKey) {
    throw makeCodedError('Missing appKey', 400)
  }

  return localServerRunQueue.next(async () => {
    const manager = appKeyToLocalServerManager.get(params.data.appKey)
    appKeyToLocalServerManager.delete(params.data.appKey)
    if (manager) {
      await manager.stop()
    }
    return makeJsonResponse({})
  })
})

const getProjectStatus = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = ProjectRequestParams.safeParse(getQueryParams(requestUrl))
  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  if (!params.data.appKey) {
    throw makeCodedError('Missing appKey', 400)
  }

  const projectEntry = getLocalProject(params.data.appKey)
  if (!projectEntry) {
    throw makeCodedError('Project for appKey not found', 404)
  }
  const serverManager = appKeyToLocalServerManager.get(params.data.appKey)
  const buildUrl = await serverManager?.getLocalBuildUrl()
  const buildRemoteUrl = await serverManager?.getLocalBuildRemoteUrl()
  return makeJsonResponse({buildUrl, buildRemoteUrl})
})

const setProjectInitialized = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = InitializeProjectParams.safeParse(getQueryParams(requestUrl))
  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  if (!params.data.appKey) {
    throw makeCodedError('Missing appKey', 400)
  }

  const projectEntry = getLocalProject(params.data.appKey)
  if (!projectEntry) {
    throw makeCodedError('Project for appKey not found', 404)
  }

  markLocalProjectInitialized(params.data.appKey)
  return makeJsonResponse({})
})

const handleProjectInitRequest = (request: Request) => {
  if (request.method === 'POST') {
    return getLocalProjectLocation(request)
  } else if (request.method === 'PATCH') {
    return setProjectInitialized(request)
  }

  return new Response('Method Not Allowed', {status: 405})
}

const handleProjectWatchRequest = (request: Request) => {
  if (request.method === 'POST') {
    return startWatch(request)
  } else if (request.method === 'DELETE') {
    return stopWatch(request)
  }

  return new Response('Method Not Allowed', {status: 405})
}

const handleProjectStatusRequest = (request: Request) => {
  if (request.method === 'GET') {
    return getProjectStatus(request)
  }

  return new Response('Method Not Allowed', {status: 405})
}

const isValidProject = async (location: string) => {
  try {
    const srcPath = path.join(location, 'src')
    const stats = await fs.stat(srcPath)
    return stats.isDirectory()
  } catch {
    return false
  }
}

const getAllProjects = withErrorHandlingResponse(async () => {
  const projects = getLocalProjects()
  const projectEntries = await Promise.all(projects.map(async ({appKey, ...rest}) => {
    const localProject = getLocalProject(appKey)
    // Check if local project still exists
    if (localProject) {
      const isValid = await isValidProject(localProject.location)
      return [appKey, {...rest, validLocation: isValid}]
    }
    return [appKey, {...rest, validLocation: true}]
  }))
  const projectByAppKey = Object.fromEntries(projectEntries)

  return makeJsonResponse({projectByAppKey})
})

const handleProjectListRequest = (request: Request) => {
  if (request.method === 'GET') {
    return getAllProjects(request)
  }

  return new Response('Method Not Allowed', {status: 405})
}

const postRevealProject = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = ProjectRequestParams.safeParse(getQueryParams(requestUrl))
  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  if (!params.data.appKey) {
    throw makeCodedError('Missing appKey', 400)
  }

  const project = getLocalProject(params.data.appKey)
  if (!project) {
    throw makeCodedError('Project for appKey not found', 404)
  }

  const projectSrcPath = getProjectSrcPath(project.location)

  try {
    const info = await fs.stat(projectSrcPath)
    if (!info.isDirectory()) {
      throw makeCodedError('Project is not a directory', 400)
    } else {
      shell.openPath(projectSrcPath)
    }
    return makeJsonResponse({})
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && error.code === 'ENOENT') {
        throw makeCodedError('Project not found', 404)
      }
    }
    throw error
  }
})

const handleProjectRevealRequest = (request: Request) => {
  if (request.method === 'POST') {
    return postRevealProject(request)
  }

  return new Response('Method Not Allowed', {status: 405})
}

const postOpenProject = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = ProjectRequestParams.safeParse(getQueryParams(requestUrl))
  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  if (!params.data.appKey) {
    throw makeCodedError('Missing appKey', 400)
  }

  const project = getLocalProject(params.data.appKey)
  if (!project) {
    throw makeCodedError('Project for appKey not found', 404)
  }

  try {
    const info = await fs.stat(project.location)
    if (!info.isDirectory()) {
      throw makeCodedError('Project is not a directory', 400)
    } else {
      await openInCodeEditor(project.location)
    }
    return makeJsonResponse({})
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error && error.code === 'ENOENT') {
        throw makeCodedError('Project not found', 404)
      }
    }
    throw error
  }
})

const handleProjectOpenRequest = (request: Request) => {
  if (request.method === 'POST') {
    return postOpenProject(request)
  }

  return new Response('Method Not Allowed', {status: 405})
}

const deleteLocalProject = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = ProjectRequestParams.safeParse(getQueryParams(requestUrl))
  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  if (!params.data.appKey) {
    throw makeCodedError('Missing appKey', 400)
  }

  const project = getLocalProject(params.data.appKey)

  if (project) {
    try {
    // Delete the project folder and all its contents
      await fs.rm(project.location, {recursive: true, force: true})
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'ENOENT') {
        // Folder doesn't exist, that's fine
        } else {
          throw makeCodedError(`Failed to delete project folder: ${error.message}`, 500)
        }
      } else {
        throw error
      }
    }
  }

  deleteLocalProjectEntry(params.data.appKey)

  return makeJsonResponse({})
})

const handleProjectDeleteRequest = (request: Request) => {
  if (request.method === 'DELETE') {
    return deleteLocalProject(request)
  }

  return new Response('Method Not Allowed', {status: 405})
}

const pickNewProjectLocation = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = ProjectRequestParams.safeParse(getQueryParams(requestUrl))

  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  if (!params.data.appKey) {
    throw makeCodedError('Missing appKey', 400)
  }

  const projectEntry = getLocalProject(params.data.appKey)
  if (!projectEntry) {
    throw makeCodedError('Project for appKey not found', 404)
  }

  const dialogResult = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    defaultPath: projectEntry.location,
  })

  if (dialogResult.canceled) {
    throw makeCodedError('Failed to retrieve new location', 404)
  }

  const newLocation = dialogResult.filePaths[0]
  const projectFolderName = path.basename(projectEntry.location)
  const newProjectLocationPath = path.join(newLocation, projectFolderName)

  if (newProjectLocationPath === projectEntry.location) {
    throw makeCodedError('The selected location is the same as the current project location', 400)
  }

  return makeJsonResponse({projectPath: newProjectLocationPath})
})

const handleProjectPickNewLocationRequest = (request: Request) => {
  if (request.method === 'PATCH') {
    return pickNewProjectLocation(request)
  }

  return new Response('Method Not Allowed', {status: 405})
}

const isValidNewLocation = async (newLocation: string) => {
  try {
    const stat = await fs.stat(newLocation)
    // NOTE(johnny): If newLocation is a directory and not empty, throw error
    if (!stat.isDirectory()) {
      throw makeCodedError(`The provided path is not a directory: ${newLocation}`, 409)
    }
    const contents = await fs.readdir(newLocation)
    // Filter out common hidden files that shouldn't prevent folder use
    const visibleContents = contents.filter(item => !item.startsWith('.') || item === '.gitkeep')
    if (visibleContents.length > 0) {
      const itemsList = visibleContents.join(', ')
      const message = `The provided path already exists and is not empty: ${newLocation} ` +
          `(contains: ${itemsList})`
      throw makeCodedError(message, 409)
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // Path doesn't exist - this is valid, we can create it
      return
    }
    // Re-throw any other errors from our validation above
    if (error.message && error.message.includes('The provided path')) {
      throw error
    }
    throw makeCodedError(`Failed to access path: ${newLocation}: ${error.message}`, 500)
  }
}

const changeProjectLocation = withErrorHandlingResponse(async (req: Request) => {
  const requestUrl = new URL(req.url)
  const params = MoveProjectParams.safeParse(getQueryParams(requestUrl))

  if (!params.success) {
    throw makeCodedError('Invalid query params', 400)
  }

  if (!params.data.appKey) {
    throw makeCodedError('Missing appKey', 400)
  }

  const projectEntry = getLocalProject(params.data.appKey)
  if (!projectEntry) {
    throw makeCodedError('Project for appKey not found', 404)
  }

  let {newLocation} = params.data

  if (!newLocation) {
    newLocation = await locationPrompt()
    if (!newLocation) {
      throw makeCodedError('Failed to retrieve new location', 404)
    }
  }

  const isCurrentLocationValid = projectEntry.location &&
  await isValidProject(projectEntry.location)

  // NOTE(johnny): If the project is invalid we are in the "locate" flow.
  if (!isCurrentLocationValid) {
    const isNewLocationValid = await isValidProject(newLocation)
    if (isNewLocationValid) {
      upsertLocalProject(params.data.appKey, newLocation, 'done')
      return makeJsonResponse({})
    }

    await isValidNewLocation(newLocation)
    upsertLocalProject(params.data.appKey, newLocation, 'needs-initialization')
  } else {  // NOTE(johnny):  We are in the "Change disk location" flow.
    await isValidNewLocation(newLocation)

    if (projectEntry.initialization === 'done') {
      try {
        await fs.rename(projectEntry.location, newLocation)
      } catch (error: any) {
        throw makeCodedError(`Failed to move project files: ${error.message}`, 500)
      }
    }

    upsertLocalProject(params.data.appKey, newLocation, projectEntry.initialization)
  }

  return makeJsonResponse({})
})

const handleProjectMoveRequest = (request: Request) => {
  if (request.method === 'PATCH') {
    return changeProjectLocation(request)
  }

  return new Response('Method Not Allowed', {status: 405})
}

const handleProjectRequest = (request: Request) => {
  const requestUrl = new URL(request.url)
  const {pathname} = requestUrl

  switch (pathname) {
    case PROJECT_INIT_PATH:
      return handleProjectInitRequest(request)
    case PROJECT_WATCH_PATH:
      return handleProjectWatchRequest(request)
    case PROJECT_STATUS_PATH:
      return handleProjectStatusRequest(request)
    case PROJECT_LIST_PATH:
      return handleProjectListRequest(request)
    case PROJECT_REVEAL_IN_FINDER_PATH:
      return handleProjectRevealRequest(request)
    case PROJECT_OPEN_PATH:
      return handleProjectOpenRequest(request)
    case PROJECT_DELETE_PATH:
      return handleProjectDeleteRequest(request)
    case PROJECT_PICK_NEW_LOCATION_PATH:
      return handleProjectPickNewLocationRequest(request)
    case PROJECT_MOVE_PATH:
      return handleProjectMoveRequest(request)
    default: {
      // eslint-disable-next-line no-console
      console.error('Unknown project request:', pathname)
      return new Response('Not Found', {status: 404})
    }
  }
}

app.on('before-quit', async (event) => {
  if (appKeyToLocalServerManager.size > 0) {
    event.preventDefault()

    await Promise.all(
      Array.from(appKeyToLocalServerManager.values()).map(manager => manager.stop())
    )
    appKeyToLocalServerManager.clear()

    app.quit()
  }
})

export {
  handleProjectRequest,
}
