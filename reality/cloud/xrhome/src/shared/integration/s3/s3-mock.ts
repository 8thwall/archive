import {generateCreateMock} from '../../registry-mock'
import {S3} from './s3-api'

const createS3Mock = generateCreateMock(S3)

// Helper method to generate s3-like async responses
const s3Async = (callback: (e: Error, result: any) => void, error: Error, result: any) => {
  if (callback) {
    callback(error, result)
  }
  return {
    promise: () => {
      if (error) {
        return Promise.reject(error)
      } else {
        return Promise.resolve(result)
      }
    },
  }
}

export {
  createS3Mock,
  s3Async,
}
