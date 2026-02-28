'use strict'

module.exports = {
  diff: true,
  extension: ['js', 'ts'],
  require: ['esm', 'ts-mocha', 'test/mocha.env', 'tsconfig-paths/register'],
  slow: 75,
  timeout: 2000,
  colors: true,
  // NOTE(kyle): mocha-jenkins-reporter does not support parallel mode.
  parallel: !process.env.JUNIT_REPORT_PATH,
  'watch-files': ['test/*test.js', 'test/*test.ts'],
}
