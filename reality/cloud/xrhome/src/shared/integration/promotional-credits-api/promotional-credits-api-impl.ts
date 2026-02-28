import AWS from 'aws-sdk'

import {type Environment, getDataRealmForEnvironment} from '../../data-realm'
import type {CreateGrantsParams} from './promotional-credits-api'

const createPromotionalCreditsApi = (env: Environment) => {
  const createGrants = async (params: CreateGrantsParams) => {
    const isProd = getDataRealmForEnvironment(env) === 'prod'
    // TODO(Brandon): Update with actual prod Lambda ARN when available.
    const promotionalCreditsLambdaArn = isProd
      ? 'publish-promotional-credi-promotionalcreditshandle-PUUgWII4U6ak'
      : 'publish-promotional-credi-promotionalcreditshandle-BOsJIX3OtV7v'
    const lambda = new AWS.Lambda()
    const res = await lambda.invoke({
      FunctionName: promotionalCreditsLambdaArn,
      Payload: JSON.stringify(params),
    }).promise()

    // TODO(Brandon): Improve error handling for failed SNS message deliveries.
    if (res.FunctionError) {
      throw new Error('Failed to grant credits.')
    }

    return res
  }

  return {
    createGrants,
  }
}

export {
  createPromotionalCreditsApi,
}
