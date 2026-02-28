#!/usr/local/bin/node

// # Usage: ./reality/scripts/unit-test-diff.js <commitid> (optional)

const {exec: execNode} = require('child_process')
const {join, relative, dirname} = require('path')
const {promises: {access, readFile}} = require('fs')

const {getProjectRoot, isUnitTest, fileIsTestableBy} = require('./unit-test-paths')

// Tests that use a local postgres database aren't ready for CI jobs
const LOCAL_POSTGRES_TESTS = new Set([
  'reality/cloud/xrhome/test/module-user-controller-test.ts',
  // TODO (tri) clean up this list after billing work
  'reality/cloud/aws/lambda/stripe-event-handler/test/invoices-payment-events-test.ts',
  'reality/cloud/aws/lambda/stripe-event-handler/test/subscriptions-test.ts',
  'reality/cloud/aws/lambda/stripe-event-handler/test/subscriptions-updated-events-test.ts',
  'reality/cloud/aws/lambda/stripe-event-handler/test/upgrades-list-payment-violations-test.ts',
  'reality/cloud/aws/lambda/stripe-event-handler/test/upgrades-upgrade-from-items-test.ts',
  // eslint-disable-next-line max-len
  'reality/cloud/aws/lambda/stripe-event-handler/test/invoices-payment-events-unpaid-reactivate-test.ts',
])

// These folders require --legacy-peer-deps added to the npm install command.
const LEGACY_INSTALL_FOLDERS = new Set([
  'reality/cloud/xrhome/',
  'reality/cloud/xrreleases/server-admin/',
])

const logVerbose = false
const logDebug = false
const logOutput = true

const verbose = (...args) => {
  // eslint-disable-next-line no-console
  if (logVerbose) console.log(...args)
}

const debug = (...args) => {
  // eslint-disable-next-line no-console
  if (logDebug) console.log(...args)
}

const output = (...args) => {
  // eslint-disable-next-line no-console
  if (logOutput) console.log(...args)
}

const root = join(__dirname, '../..')

const getCommandOutput = command => new Promise((resolve) => {
  execNode(command, {cwd: root}, (err, stdout) => {
    if (err) {
      debug('Command failed:', command, typeof err, err)
    }
    resolve(stdout.toString())
  })
})

const exist = async (p) => {
  try {
    await access(p)
    debug('can access', p)
    return true
  } catch {
    debug('cannot access', p)
    return false
  }
}

const resolveTestCommand = async (projectRoot, unitTest) => {
  const packagePath = join(projectRoot, 'package.json')
  if (!await exist(packagePath)) {
    return 'npx mocha'
  }
  const contents = await readFile(packagePath)
  try {
    const package = JSON.parse(contents)

    if (package.scripts && package.scripts['test-file']) {
      return 'npm run test-file'
    }
    const usesTypescript = unitTest.endsWith('.ts') || (
      !!package.dependencies['ts-mocha'] ||
      !!package.devDependencies['ts-mocha']
    )

    return usesTypescript ? 'npx ts-mocha' : 'npx mocha'
  } catch (err) {
    throw new Error(`Unable to parse ${packagePath}`)
  }
}

const runUnitTest = async (unitTest) => {
  const enclosingFolder = getProjectRoot(unitTest)
  const baseCommand = await resolveTestCommand(enclosingFolder, unitTest)

  const unitTestCommand = [
    baseCommand,
    relative(enclosingFolder, unitTest),
    '--forbid-only',
    '--exit',
    '--no-color',
  ].join(' ')

  return new Promise((resolve) => {
    execNode(unitTestCommand, {cwd: enclosingFolder}, (err, stdout, stderror) => {
      if (err) {
        resolve({unitTest, statusCode: err.code, stdout, stderror})
        debug('Command failed:', {unitTestCommand, err, stdout, stderror})
      }
      resolve({unitTest, statusCode: 0})
    })
  })
}

// run unit test sequentially
const runUnitTests = async (unitTests) => {
  const testResults = []
  await unitTests.reduce((chain, unitTest) => chain.then(async () => {
    verbose(`starting a test: ${unitTest}`)
    testResults.push(await runUnitTest(unitTest))
  }), Promise.resolve())
  return testResults
}

const listChangedFiles = async (fromCommit) => {
  const changedFilesCommand = [
    'git diff',
    '-w',                 // Ignore whitespace changes
    '--name-status',      // Show filenames instead of lines
    '--diff-filter=MAR',  // Limit to modified, added, renamed
    '-z',                 // Use a NUL character delimited output
    fromCommit,
    '',
  ].join(' ')

  const outputParts = (await getCommandOutput(changedFilesCommand)).split('\x00').filter(Boolean)

  debug({outputParts})

  const changedFiles = []

  let index = 0
  while (index < outputParts.length) {
    let to

    // Rename lines have two filenames, the rest have one.
    switch (outputParts[index][0]) {
      case 'M':
      case 'A':
        to = outputParts[index + 1]
        index += 2
        break
      case 'R':
        to = outputParts[index + 2]
        index += 3
        break
      default:
        throw new Error(`Unexpected element: ${outputParts[index]}`)
    }

    if (to.match(/\\|'|`/)) {
      throw new Error(`Invalid filename: ${to}`)
    }

    changedFiles.push(to)
  }

  return changedFiles
}

const ensureNodeModulesInstalled = async (folder) => {
  const jsonPackagePath = join(folder, 'package.json')
  const exists = await exist(jsonPackagePath)

  if (exists) {
    debug(`installing at folder ${folder}`)
    await new Promise((resolve, reject) => {
      const flags = []

      if (LEGACY_INSTALL_FOLDERS.has(folder)) {
        flags.push('--legacy-peer-deps')
      }

      execNode(
        `bazel run //bzl/node:npm --run_under="cd $PWD && " -- install ${flags.join(' ')}`,
        {cwd: folder}, (err, stdout) => {
          if (err) {
            debug('Command failed:', 'npm install', typeof err, err)
            reject(err)
          } else {
            resolve(stdout.toString())
          }
        }
      )
    })
  }

  // TODO(christoph): Remove this
  if (folder.endsWith('/xrreleases/server-admin/')) {
    await ensureNodeModulesInstalled(dirname(folder))
  }
}

const filterAvailableTestFiles = (files) => {
  if (process.env.EXCLUDE_POSTGRES_TESTS === 'true') {
    return files.filter(file => !LOCAL_POSTGRES_TESTS.has(file))
  } else {
    return files
  }
}

const getErrorsBetweenCommit = async (fromCommit) => {
  const changedFiles = await listChangedFiles(fromCommit)
  verbose({changedFiles})
  const newUnitTestFiles = changedFiles.filter(isUnitTest)  // for staged files
  const gitCommand = 'git ls-tree -r HEAD --name-only | grep -E "(^|/)test/.*-test.[tj]s$"'
  const unitTestFilenames = (await getCommandOutput(gitCommand)).split('\n').filter(Boolean)
  const testsToRun = filterAvailableTestFiles(Array.from(new Set(unitTestFilenames
    .filter(testfile => changedFiles.some(file => fileIsTestableBy(file, testfile)))
    .concat(newUnitTestFiles))))

  verbose({unitTestFilenames})
  verbose({testsToRun})
  const projectRoots = new Set(testsToRun.map(f => getProjectRoot(f)))

  // NOTE(christoph): xrhome has shared files imported into other projects, so for now just assume
  // it's required to be present. Bazel fixes this if we were to switch.
  if (projectRoots.size) {
    projectRoots.add('reality/cloud/xrhome/')
  }
  await Promise.all(Array.from(projectRoots).map(f => ensureNodeModulesInstalled(f)))
  verbose('starting tests')
  const results = await runUnitTests(testsToRun)

  debug({results})

  return results.filter(result => result.statusCode > 0)
}

const run = async (fromCommit) => {
  try {
    const failingTestsFiles = await getErrorsBetweenCommit(fromCommit)
    if (failingTestsFiles.length) {
      failingTestsFiles.forEach((f) => {
        output(f.unitTest)
        if (f.stdout) {
          output(f.stdout)
        }
        if (f.stderror) {
          output(f.stderror)
        }
      })
      process.exit(failingTestsFiles.length)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  }
}
run(process.argv[2] || 'HEAD')
