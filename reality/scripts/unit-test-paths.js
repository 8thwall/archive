const getProjectRoot = fn => fn.replace(/(^|\/)test\/.*$/, '$1')

const isUnitTest = f => !!f.match(/(^|\/)test\/.*-test\.[tj]s$/)

const {basename} = require('path')

const fileIsTestableBy = (filename, unitTestFilename) => {
  if (filename === unitTestFilename) {
    return true
  }

  if (!filename.startsWith(getProjectRoot(unitTestFilename))) {
    return false
  }

  const fileBase = basename(filename).split('.')[0]
  const unitTestBase = basename(unitTestFilename).split('-test.')[0]

  if (unitTestBase === fileBase) {
    return true
  }

  if (filename.includes('i18n') && unitTestBase === 'strings-validation') {
    return true
  }

  // Handle prefixes like my-file.ts getting tested by my-file-simple-test.js
  return unitTestBase.startsWith(fileBase) && (unitTestBase[fileBase.length] === '-')
}

module.exports = {
  getProjectRoot,
  isUnitTest,
  fileIsTestableBy,
}
