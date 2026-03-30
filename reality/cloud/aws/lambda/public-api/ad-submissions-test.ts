// @attr(npm_rule = "@npm-public-api//:npm-public-api")
// @attr(externalize_npm = True)

import {Sequelize} from 'sequelize'
import {describe, it, assert, before, beforeEach, afterEach} from '@nia/bzl/js/chai-js'

import {handleAdSubmissionStatusPost} from './ad-submissions'
import {makeRequestContext} from './test/common'
import * as models from './models'
import {initializeModels} from './models/init'

const ACCOUNT = {
  uuid: 'account1',
  shortName: 'account1',
  status: 'ENABLED',
}

const APP = {
  uuid: 'app1',
  AccountUuid: ACCOUNT.uuid,
  name: 'app1',
  appKey: 'app1',
  status: 'ENABLED',
}

const AD_SUBMISSION = {
  uuid: 'uuid1',
  AppUuid: APP.uuid,
  reviewStatus: 'PENDING',
  requestUuid: 'bb5070ab-1861-492f-8d81-cb7260ef1ea8',
  commitId: 'commit_id',
  createdAt: '2023-06-09T16:49:11.651Z',
}

const generateAdSubmissionPatchRequest = (body, request = null, isPrivileged = true) => ({
  httpMethod: 'PATCH',
  headers: {'Content-Type': 'application/json'},
  pathParameters: {adApprovalRequestId: AD_SUBMISSION.requestUuid},
  ...request,
  body: JSON.stringify(body),
  ...makeRequestContext(isPrivileged),
})

describe('AdSubmissions', () => {
  let sequelize

  before(() => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })

    models.register(initializeModels(sequelize))
  })
  beforeEach(async () => {
    await sequelize.sync()
    const {Account, AdSubmission, App} = models.use()
    await Account.create(ACCOUNT)
    await App.create(APP)
    await AdSubmission.create(AD_SUBMISSION)
  })
  afterEach(async () => {
    await sequelize.drop()
  })
  describe('When handleAdSubmissionStatusPost is called', () => {
    it('should return updated AdSubmission', async () => {
      const requestBody = {
        status: 'APPROVED',
        decisionExplanation: 'LGTM',
      }
      const request = generateAdSubmissionPatchRequest(requestBody)

      const response = await handleAdSubmissionStatusPost(request)

      assert.equal(response.statusCode, 200)
      const actual = JSON.parse(response.body)
      const expectedAdSubmissionSubset = {
        ...AD_SUBMISSION,
        reviewStatus: requestBody.status,
        decisionExplanation: requestBody.decisionExplanation,
      }

      assert.include(actual, expectedAdSubmissionSubset)
    })
    it('should return NotFound response when AdSubmission cannot be found', async () => {
      const nonExistentRequestId = '70033c11-9a9b-4eda-8ae3-fbfb48764473'
      const requestBody = {
        status: 'APPROVED',
      }
      const pathParameters = {adApprovalRequestId: nonExistentRequestId}
      const request = generateAdSubmissionPatchRequest(
        requestBody, {pathParameters}
      )

      const response = await handleAdSubmissionStatusPost(request)

      assert.equal(response.statusCode, 404)
    })
    it('should return BadRequest response when provided invalid requests', async () => {
      const patchAdSubmission = (body, headers = null, pathParameters = null) => (
        handleAdSubmissionStatusPost({
          httpMethod: 'PATCH',
          headers: headers ?? {'Content-Type': 'application/json'},
          pathParameters: pathParameters ?? {adApprovalRequestId: AD_SUBMISSION.requestUuid},
          body: JSON.stringify(body),
          ...makeRequestContext(),
        })
      )

      const shouldAllReject = [
        await patchAdSubmission({}, {'Content-Type': 'not application/json'}),
        await patchAdSubmission({}, undefined, {adApprovalRequestId: 'not an uuid'}),
        await patchAdSubmission({someUnknownField: 'not-valid'}),
        await patchAdSubmission({status: 'not-a-valid-status'}),
        await patchAdSubmission({status: 'APPROVED', decisionExplanation: 1}),
      ]

      shouldAllReject.forEach((res) => {
        assert.equal(res.statusCode, 400)
      })
    })

    it('should return Forbidden when request is not privileged', async () => {
      const requestBody = {
        status: 'APPROVED',
      }
      const request = generateAdSubmissionPatchRequest(
        requestBody, {}, false
      )

      const response = await handleAdSubmissionStatusPost(request)

      assert.equal(response.statusCode, 403)
    })
  })
})
