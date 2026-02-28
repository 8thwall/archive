#!/usr/bin/env node

// @rule(js_cli)
// @package(npm-eslint)
// @attr[](data = "@npm-eslint//:modules")
// @attr(externals = "*")

// # Usage: ./scripts/eslint-diff.sh <commitid> <commitid2(optional)>

const {exec: execNode} = require('child_process')
const {join} = require('path')
const {promises: {readFile}} = require('fs')
const {CLIEngine} = require('eslint')

const eslint = new CLIEngine({cache: true})

const DISABLED_RULES = new Set(['import/no-unresolved'])

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

const root = process.cwd()

const getCommandOutput = command => new Promise((resolve) => {
  execNode(command, {cwd: root}, (err, stdout) => {
    if (err) {
      debug('Command failed:', command, typeof err, err)
    }
    resolve(stdout.toString())
  })
})

const isLintable = async (commit, filename) => {
  if (!filename.match(/\.[tj]sx?$/)) {
    debug('Ignoring non-js/ts/jsx/tsx file', filename)
    return false
  }

  let isSymlink
  if (commit) {
    const fileData = await getCommandOutput(`git ls-tree ${commit} ${filename}`)
    const dataBits = parseInt(fileData.split(' ')[0], 8)
    // https:// github.com/git/git/blob/master/Documentation/technical/index-format.txt#L67
    // eslint-disable-next-line no-bitwise
    isSymlink = (dataBits >> 12) === 0b1010
  } else {
    isSymlink = !!(await getCommandOutput(`find ${filename}  -type l`))
  }

  if (isSymlink) {
    return false
  }

  const wordCountCommand = commit
    ? `git show ${commit}:${filename} | wc`
    : `wc '${filename}'`

  let lineCount
  let characterCount
  ;[lineCount, , characterCount] = (await getCommandOutput(wordCountCommand))
    .split(' ')
    .filter(Boolean)

  lineCount = Number(lineCount)
  characterCount = Number(characterCount)

  if (lineCount > 10000 || characterCount > 100000 || characterCount / (lineCount + 1) > 150) {
    return false
  }

  return true
}

const getFileAtCommit = (commit, fileName) => {
  if (commit) {
    return getCommandOutput(`git show '${commit}:${fileName}'`)
  } else {
    return readFile(fileName, {encoding: 'utf-8'})
  }
}

const getNewLines = async (fromCommit, toCommit, fromFilePath, toFilePath) => {
  const newLinesCommand = [
    'git diff',
    '-w',        // Ignore whitespace changes
    '-U100000',  // Show full file instead of only context around changes
    fromCommit,
    toCommit,
    '--',
    fromFilePath ? `'${fromFilePath}'` : '',
    `'${toFilePath}'`,
  ].join(' ')

  const diffOutput = await getCommandOutput(newLinesCommand)

  if (diffOutput === '') {
    // All changes are whitespace-only
    return new Set()
  }

  const diffLines = diffOutput.split('\n')

  if (diffLines[1] === 'similarity index 100%') {
    return new Set()
  }

  const lastHeaderIndex = diffLines.findIndex(l => l.startsWith('@@ '))

  if (lastHeaderIndex === -1) {
    throw new Error(`Unexpected git diff format for ${toFilePath}`)
  }

  const finalLines = diffLines
    .slice(lastHeaderIndex + 1)
    .filter(l => !l.startsWith('-'))

  const newLines = new Set()

  finalLines.forEach((line, index) => {
    if (line.startsWith('+')) {
      newLines.add(index + 1)  // Eslint is 1-indexed
    }
  })

  debug({
    newLinesCount: newLines.size,
    length: finalLines.length,
  })

  return newLines
}

const ALL_CLEAR = () => ({
  errorCount: 0,
  messages: [],
})

const lintFileAtCommit = async (commit, filePath) => {
  if (!filePath) {
    return ALL_CLEAR()
  }

  let fileContents
  try {
    fileContents = await getFileAtCommit(commit, filePath)
  } catch (err) {
    // If the fileContents can't be read, there's probably no file at that commit, so no errors.
    return ALL_CLEAR()
  }

  const report = await eslint.executeOnText(fileContents, join(root, filePath))

  if (!report || !report.results || !report.results[0]) {
    verbose(`Missing report for${filePath}`)
    return ALL_CLEAR()
  }

  const status = report.results[0]

  return {
    errorCount: status.errorCount,
    messages: status.messages,
  }
}

const getNewLintErrors = async (fromCommit, toCommit, fromFilePath, toFilePath) => {
  const [before, after, newLines] = await Promise.all([
    lintFileAtCommit(fromCommit, fromFilePath),
    lintFileAtCommit(toCommit, toFilePath),
    getNewLines(fromCommit, toCommit, fromFilePath, toFilePath),
  ])

  const preexistingMessages = new Set(before.messages.map(e => e.message))

  const newErrors = after.messages.filter((message) => {
    if (DISABLED_RULES.has(message.ruleId)) {
      return false
    }
    if (newLines.has(message.line)) {
      debug(toFilePath, 'has new error', message.message)
      return true
    }

    // If the line isn't present in "newLines", we can ignore the max-len rule.
    if (message.ruleId === 'max-len') {
      return false
    }

    return !preexistingMessages.has(message.message)
  })

  debug({
    fromFilePath,
    toFilePath,
    newLines: [...newLines].join(', '),
    pre: [...preexistingMessages].join('\n'),
    new: newErrors.map(e => `${e.message} (${e.line})`).join('\n'),
    after: after.messages.map(e => `${e.message} (${e.line})`).join('\n'),
  })

  return {
    beforeErrorCount: before.errorCount,
    afterErrorCount: after.errorCount,
    newErrors,
  }
}

const listChangedFiles = async (fromCommit, toCommit) => {
  const changedFilesCommand = [
    'git diff',
    '-w',                  // Ignore whitespace changes
    '--name-status',       // Show filenames instead of lines
    '--diff-filter=MARD',  // Limit to modified, added, renamed, or deleted files
    '-z',                  // Use a NUL character delimited output
    fromCommit,
    toCommit,
  ].join(' ')

  const outputParts = (await getCommandOutput(changedFilesCommand)).split('\x00').filter(Boolean)

  debug({outputParts})

  const changedFiles = []

  let index = 0
  while (index < outputParts.length) {
    let from
    let to

    // Rename lines have two filenames, the rest have one.
    switch (outputParts[index][0]) {
      case 'M':
        from = outputParts[index + 1]
        to = from
        index += 2
        break
      case 'A':
        from = ''
        to = outputParts[index + 1]
        index += 2
        break
      case 'R':
        from = outputParts[index + 1]
        to = outputParts[index + 2]
        index += 3
        break
      case 'D':
        from = outputParts[index + 1]
        to = ''
        index += 2
        break
      default:
        throw new Error(`Unexpected element: ${outputParts[index]}`)
    }

    const invalidFilename = [from, to].find(f => f.match(/\\|'|`/))
    if (invalidFilename) {
      throw new Error(`Invalid filename: ${invalidFilename}`)
    }

    changedFiles.push({from, to})
  }

  return changedFiles
}

const MAX_MESSAGE_LENGTH = 70

const toFixedLength = (s, maxLength) => {
  if (s.length <= maxLength) {
    return s.padEnd(maxLength)
  } else {
    return `${s.substr(0, maxLength - 3)}...`
  }
}

const getErrorLine = (error) => {
  const line = [
    error.line.toString().padStart(5),
    ':',
    error.column.toString().padEnd(4),
    ' ',
    toFixedLength(error.message, MAX_MESSAGE_LENGTH),
    ' ',
    (error.ruleId || ''),
    error.fix ? ' (Fixable)' : '',
  ].join('')

  return line
}

const getErrorsBetweenCommit = async (fromCommit, toCommit) => {
  const changedFiles = await listChangedFiles(fromCommit, toCommit)

  verbose({changedFiles})

  const lintableResults = await Promise.all(changedFiles.map(f => isLintable(toCommit, f.to)))

  const lintableFiles = changedFiles.filter((_, i) => lintableResults[i])

  verbose({lintableFiles})

  const results = await Promise.all(
    lintableFiles.map(({from, to}) => getNewLintErrors(fromCommit, toCommit, from, to))
  )

  debug({results})

  let beforeTotalErrors = 0
  let afterTotalErrors = 0
  let newTotalErrors = 0

  const worseFiles = lintableFiles.filter((filename, index) => {
    const {beforeErrorCount, afterErrorCount, newErrors} = results[index]

    beforeTotalErrors += beforeErrorCount
    afterTotalErrors += afterErrorCount
    newTotalErrors += newErrors.length

    if (newErrors.length) {
      output(filename.to)
      newErrors.forEach(e => output(getErrorLine(e)))
      output('')
      return true
    } else {
      return false
    }
  })

  verbose(`Error count went from ${beforeTotalErrors} to ${afterTotalErrors}`)

  return {
    worseFilesCount: worseFiles.length,
    beforeTotalErrors,
    afterTotalErrors,
    newTotalErrors,
  }
}

const run = async (fromCommit, toCommit) => {
  try {
    const {newTotalErrors} = await getErrorsBetweenCommit(fromCommit, toCommit)
    if (newTotalErrors) {
      process.exit(newTotalErrors)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  }
}

run(process.argv[2] || 'HEAD', process.argv[3] || '')
