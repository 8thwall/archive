const ROOT_PATH = '/'

const HOME_PATH = '/home'

const HOME_PATH_FORMAT = '/home/:accountUuid?'

type HomePathParams = {
  accountUuid: string
}

const getHomePath = (accountUuid: string) => HOME_PATH_FORMAT.replace(':accountUuid?', accountUuid)

const LOGIN_PATH = '/login'

const STUDIO_PATH_FORMAT = '/studio/:appKey'

type StudioPathParams = {
  appKey: string
}

const getStudioPath = (appKey: string) => STUDIO_PATH_FORMAT.replace(':appKey', appKey)

export {
  HOME_PATH,
  HOME_PATH_FORMAT,
  LOGIN_PATH,
  STUDIO_PATH_FORMAT,
  ROOT_PATH,
  getStudioPath,
  getHomePath,
}

export type {
  StudioPathParams,
  HomePathParams,
}
