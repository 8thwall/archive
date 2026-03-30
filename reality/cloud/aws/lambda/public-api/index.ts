// @rule(js_binary)
// @attr(commonjs = True)
// @attr(export_library = True)
// @attr(esnext = True)
// @attr(externals = "*")
// @attr(npm_rule = "@npm-public-api//:npm-public-api")
// @attr(target = "node")

import {Sequelize} from 'sequelize'
import pg from 'pg'
import {S3} from '@aws-sdk/client-s3'
import {URL} from 'url'

import {createSecretsFetcher} from '@nia/reality/cloud/aws/lambda/shared/set-secrets'

// @dep(//reality/cloud/xrhome/certs:rds)
// @inliner-skip-next
import dbCert from '@nia/reality/cloud/xrhome/certs/rds/global-bundle.pem'

import {branch, methods} from './route'
import {respondNotFound} from './responses'
import {initializeModels} from './models/init'
import * as models from './models'
import * as s3 from './s3'

import {handleTargetsListGet, handleTargetsListPost} from './app-targets'
import {handleTargetGet, handleTargetPatch, handleTargetDelete} from './target'
import {handleTargetTestGet} from './target-test'
import {handleAdSubmissionStatusPost} from './ad-submissions'
import type {Request, Response} from './api-types'

let alreadyRegistered = false
const registerDependencies = () => {
  if (alreadyRegistered) {
    return
  }
  alreadyRegistered = true

  s3.register(new S3({region: 'us-west-2'}))

  // Cut off uri params to prevent ssl from overriding options
  // Sslmode not set on pg client
  const dbUrl = new URL(process.env.XRHOME_DB_URL)
  dbUrl.searchParams.delete('ssl')
  dbUrl.searchParams.delete('sslmode')
  const dbUrlString = dbUrl.toString()

  const sequelize = new Sequelize(dbUrlString, {
    dialectOptions: {
      ssl: process.env.SECRET_NAMESPACE === 'Dev' && {
        rejectUnauthorized: false,
        requestCert: true,
        cert: [Buffer.from(dbCert)],
      },
    },
    dialectModule: pg,
  })

  models.register(initializeModels(sequelize))
}

const resolveBranches = branch({
  'v1': branch({
    'apps': branch({
      '{app}': branch({
        'targets': methods({
          GET: handleTargetsListGet,
          POST: handleTargetsListPost,
        }),
      }),
    }),
    'targets': branch({
      '{target}': branch({
        '': methods({
          GET: handleTargetGet,
          PATCH: handleTargetPatch,
          DELETE: handleTargetDelete,
        }),
        'test': methods({
          GET: handleTargetTestGet,
        }),
      }),
    }),
    'ad-submissions': branch({
      '{adApprovalRequestId}': branch({
        'status': methods({
          POST: handleAdSubmissionStatusPost,
        }),
      }),
    }),
  }),
})

const fetchSecrets = createSecretsFetcher(process.env.AWS_REGION, process.env.SECRET_NAMESPACE, [
  'XRHOME_DB_URL',
  'TARGET_TESTER_SECRET',
  'XRHOME_PUBLIC_API_KEY',
  'PUBLIC_API_CONTINUATION_TOKEN_SIGNING',
])

const handler = async (request: Request): Promise<Response> => {
  Object.assign(process.env, await fetchSecrets())
  // eslint-disable-next-line no-console
  console.log({...request, body: null, bodyLength: request.body && request.body.length})
  registerDependencies()
  const requestHandler = resolveBranches(request.path, request.httpMethod, request.pathParameters)
  if (requestHandler) {
    return requestHandler(request)
  } else {
    return respondNotFound('Route')
  }
}

export {
  handler,
}
