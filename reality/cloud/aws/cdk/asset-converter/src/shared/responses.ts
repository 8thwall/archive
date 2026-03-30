const NOT_FOUND_RESPONSE = {
  statusCode: 404,
  body: JSON.stringify({message: 'Not found'}),
} as const

const INVALID_REQUEST_RESPONSE = {
  statusCode: 400,
  body: JSON.stringify({message: 'Invalid request'}),
}

const makeInvalidRequestResponse = (message: string) => ({
  statusCode: 400,
  body: JSON.stringify({message: message ?? 'Invalid request'}),
})

export {
  makeInvalidRequestResponse,
  NOT_FOUND_RESPONSE,
  INVALID_REQUEST_RESPONSE,
}
