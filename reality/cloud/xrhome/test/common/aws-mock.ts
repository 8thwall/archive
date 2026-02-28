import AWSMock from 'aws-sdk-mock'
import AWS from 'aws-sdk'
import sinon from 'sinon'

AWSMock.setSDKInstance(AWS)

const createAwsMock = (serviceName, functionName) => {
  let currentHandler

  const spy = sinon.spy((params, callback) => {
    if (currentHandler) {
      currentHandler(params, callback)
    } else {
      callback({message: `Mocked handler is not set up (${serviceName}/${functionName})`}, null)
    }
  })

  AWSMock.mock(serviceName, functionName, spy)

  const setHandler = (newHandler) => {
    currentHandler = newHandler
  }

  const clearHandler = () => {
    currentHandler = null
  }

  const restore = () => {
    AWSMock.restore(serviceName, functionName)
  }

  return {
    setHandler,
    clearHandler,
    restore,
  }
}

const setSDKPath = (sdkPath) => {
  AWSMock.setSDK(sdkPath)
}

export {
  createAwsMock,
  setSDKPath,
}
