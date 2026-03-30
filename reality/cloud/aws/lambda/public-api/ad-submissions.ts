import {validate} from 'uuid'

import {readStandardizedHeader} from './headers'
import {isPrivilegedRequest} from './api-key'

import {respondNotFound, respondInvalidInput, respondJson, respondForbidden} from './responses'

import * as models from './models'
import type {Request, Response} from './api-types'

const validateRequestBody = (requestBody: string) => {
  let body
  try {
    body = requestBody ? JSON.parse(requestBody) : {}
  } catch (err) {
    return {
      body: null,
      validationErrorResponse: respondInvalidInput('body is not valid JSON'),
    }
  }

  const {status, decisionExplanation, ...rest} = body

  const unknownFields = Object.keys(rest)

  if (unknownFields.length) {
    return {
      body: null,
      validationErrorResponse: respondInvalidInput(
        `Unknown field(s) provided: ${unknownFields.join(', ')}`
      ),
    }
  }
  const reviewStatuses = ['APPROVED', 'REJECTED']

  if (!reviewStatuses.includes(status)) {
    return {
      body: null,
      validationErrorResponse: respondInvalidInput(
        `status must be one of the following values: ${reviewStatuses.join(', ')}`
      ),
    }
  }

  if (typeof decisionExplanation !== 'string' && decisionExplanation !== undefined) {
    return {
      body: null,
      validationErrorResponse: respondInvalidInput(
        'decisionExplanation must be a string or unspecified.'
      ),
    }
  }

  return {body}
}

const getAdSubmissionByRequestUuid = async (requestUuid: string) => {
  const {AdSubmission} = models.use()

  const adSubmission = await AdSubmission.findOne({
    where: {requestUuid},
    rejectOnEmpty: false,
  })

  return adSubmission
}

const handleAdSubmissionStatusPost = async (request: Request): Promise<Response> => {
  if (!isPrivilegedRequest(request)) {
    return respondForbidden('access to this route is not allowed')
  }

  if (readStandardizedHeader(request.headers, 'Content-Type') !== 'application/json') {
    return respondInvalidInput('Unexpected or missing content-type, expected "application/json"')
  }

  const {adApprovalRequestId} = request.pathParameters

  if (!validate(adApprovalRequestId)) {
    return respondInvalidInput('adApprovalRequestId must be a UUID')
  }

  const {body, validationErrorResponse} = validateRequestBody(request.body)

  if (validationErrorResponse) {
    return validationErrorResponse
  }

  const {status, decisionExplanation} = body
  const adSubmission = await getAdSubmissionByRequestUuid(adApprovalRequestId)

  if (!adSubmission) {
    return respondNotFound(`AdSubmission Not Found by adApprovalRequestId: ${adApprovalRequestId}`)
  }

  await adSubmission.update({reviewStatus: status, reviewedAt: new Date(), decisionExplanation})

  return respondJson(adSubmission)
}

export {
  handleAdSubmissionStatusPost,
}
