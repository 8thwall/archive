interface CodedError extends Error {
  code: number
}
const makeCodedError = (msg: string, code: number) => {
  const err = new Error(msg) as CodedError
  err.code = code
  return err
}

const isCodedError = (err: any): err is CodedError => err.code && typeof err.code === 'number'

export {
  type CodedError,
  isCodedError,
  makeCodedError,
}
