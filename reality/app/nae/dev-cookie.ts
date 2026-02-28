import jwt from 'jsonwebtoken'

import type {DevCookie} from '@nia/reality/shared/nae/nae-types'

import {createSecretScope} from '@nia/reality/cloud/aws/lambda/shared/secret-scopes'

const YEAR_EXPIRE_MS = 1000 * 3600 * 24 * 365

const secretNamespace = process.env.SECRET_NAMESPACE
if (!secretNamespace) {
  throw new Error('SECRET_NAMESPACE is not set in the environment')
}

const internalAuthScope = createSecretScope<'stagingSecret' | 'secret'>({
  region: 'us-west-2',
  prefix: secretNamespace,
  name: 'shared/internal_auth',
  version: secretNamespace === 'Prod'
    ? 'a7821271-1e4a-4714-b89a-5d46c8d48de7'
    : '969e45f8-7e2a-46c5-ba31-a67971f3c574',
})

const createStagingCookie = async (app: {workspace: string, appName: string}) => {
  const loadedSecret = await internalAuthScope.load()
  const expiration = Date.now() + YEAR_EXPIRE_MS

  const token = jwt.sign(Object.assign(app, {
    exp: Math.floor(+new Date(expiration) / 1000),
  }), loadedSecret.stagingSecret)

  // Options are based on reality/cloud/aws/lambda/studio-api/challenge.ts
  const devCookie: DevCookie = {
    name: 's',
    token,
    options: {
      domain: `.${app.workspace}.staging.8thwall.app`,
      expires: new Date(expiration),
      path: '/',
      secure: true,
      sameSite: 'lax',
      signed: false,
      httpOnly: false,
    },
  }
  return devCookie
}

// See: SetDevCookie in reality/cloud/xrhome/src/server/token.ts
const createDevCookie = async (
  workspaceShortName: string
): Promise<DevCookie> => {
  const loadedSecret = await internalAuthScope.load()
  const expiration = Date.now() + YEAR_EXPIRE_MS

  const token = jwt.sign({
    iat: Date.now(),
    exp: Date.now() + YEAR_EXPIRE_MS,
    names: [workspaceShortName],
  }, loadedSecret.secret)

  const devCookie: DevCookie = {
    name: 'dev',
    token,
    options: {
      domain: '.dev.8thwall.app',
      expires: new Date(expiration),
      path: '/',
      secure: true,
      sameSite: 'none',
      signed: true,
      httpOnly: true,
    },
  }

  return devCookie
}

export {createStagingCookie, createDevCookie}
