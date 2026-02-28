import type {Response} from 'express'

import type {FetchResult} from './signed-api-gateway'

const sendApiResult = <T>(res: Response, apiRes: FetchResult<T>) => (
  res.status(apiRes.statusCode).send(apiRes.data)
)

export {
  sendApiResult,
}
