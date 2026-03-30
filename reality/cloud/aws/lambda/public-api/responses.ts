import type {Response} from './api-types'

const respondNotFound = (thing: string): Response => ({
  statusCode: 404,
  body: JSON.stringify({message: `Not found: ${thing}`}),
})

const respondInvalidInput = (message: string): Response => ({
  statusCode: 400,
  body: JSON.stringify({message: `Invalid input: ${message}`}),
})

const respondJson = <T>(body: T): Response => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body, null, 2),
})

const respondNoContent = (): Response => ({
  statusCode: 204,
  body: '',
})

const respondForbidden = (message: string): Response => ({
  statusCode: 403,
  body: JSON.stringify({message: `Forbidden: ${message}`}),
})

export {
  respondNotFound,
  respondInvalidInput,
  respondJson,
  respondNoContent,
  respondForbidden,
}
