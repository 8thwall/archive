// @rule(js_library)

import {sign} from 'jsonwebtoken'
import {Op} from 'sequelize'
import {validate as validateUuid} from 'uuid'

import {getImageTargetForRequest} from './api-key'

import {respondInvalidInput, respondJson, respondNotFound} from './responses'
import type {Request, Response} from './api-types'

const SECONDS_PER_HOUR = 60 * 60
const MILLIS_PER_SECOND = 1000

const getBasePreviewUrl = token => (process.env.SECRET_NAMESPACE === 'Dev'
  ? `https://console-8w.dev.8thwall.app/previewit/?j=${token}`
  : `https://8w.8thwall.app/previewit/?j=${token}`)

const currentTimeSeconds = () => Math.round(Date.now() / 1000)

const handleTargetTestGet = async (request: Request): Promise<Response> => {
  const uuid = request.pathParameters.target

  if (!uuid) {
    return respondInvalidInput('Missing uuid.')
  }

  if (!validateUuid(uuid)) {
    return respondInvalidInput('Invalid UUID provided in path.')
  }

  const imageTarget = await getImageTargetForRequest({
    uuid,
    status: {[Op.notIn]: ['DELETED', 'TAKEN_DOWN']},
  }, request)

  if (!imageTarget) {
    return respondNotFound('Image Target')
  }

  const iat = currentTimeSeconds()
  const exp = iat + SECONDS_PER_HOUR

  const token = sign({
    iat,
    exp,
    target: uuid,
  }, process.env.TARGET_TESTER_SECRET)

  return respondJson({
    exp: exp * MILLIS_PER_SECOND,
    token,
    url: getBasePreviewUrl(token),
  })
}

export {
  handleTargetTestGet,
}
