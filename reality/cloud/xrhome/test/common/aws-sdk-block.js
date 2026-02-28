// Make it impossible to import 'aws-sdk' by accident in tests

function MockCloudWatch() {
  this.putMetricData = () => {
    throw new Error('AWS CloudWatch mock not set up')
  }
}

const awsSdkPath = require.resolve('aws-sdk')
require.cache[awsSdkPath] = {
  loaded: true,
  exports: {
    Promise,
    CloudWatch: MockCloudWatch,
    config: {
      // NOTE(christoph): Without this, aws-sdk-mock doesn't wrap promises correctly
      setPromisesDependency: () => { },
    },
  },
}
