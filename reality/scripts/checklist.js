#!/usr/local/bin/node

// # Usage: ./scripts/checklist.js --help

const {exec: execNode} = require('child_process')
const {join} = require('path')
const {promises: {readFile}} = require('fs')

const output = (...args) => {
  // eslint-disable-next-line no-console
  console.log(...args)
}

const root = join(__dirname, '..')
const getCommandOutput = command => new Promise((resolve, reject) => {
  execNode(command, {cwd: root, maxBuffer: 10 * 1024 * 1024}, (err, stdout) => {
    if (err) {
      reject(err)
      return
    }
    resolve(stdout.toString())
  })
})

const SOURCE_EXTENSIONS = [
  '.js', '.jsx',
  '.ts', '.tsx',
  '.yml', '.yaml',
  '.c', '.cc', '.h', '.c++', '.cpp',
  '.cs',
  '.html', '.css', '.scss',
  '.java',
  '.hpp',
  '.py',
]

const isSourceFile = filePath => (
  filePath !== 'scripts/checklist.js' &&
  SOURCE_EXTENSIONS.some(e => filePath.endsWith(e))
)

const listFiles = async (includes, excludes) => {
  const command = 'git ls-tree -r HEAD --full-tree --name-only'

  const baseFiles = (await getCommandOutput(command)).split('\n').filter(isSourceFile)

  const excluded = excludes.length
    ? baseFiles.filter(filePath => !excludes.some(prefix => filePath.startsWith(prefix)))
    : baseFiles

  const included = includes.length
    ? excluded.filter(filePath => includes.some(prefix => filePath.startsWith(prefix)))
    : excluded

  return included
}

const containsTodo = line => line.length < 300 && !!line.match(/todo/i)

const parseLine = (line) => {
  const parenMatch = line.match(/todo:? *\(([^ )]+)\) *(:|-)? *(.*)$/i)
  if (parenMatch) {
    return {
      dev: parenMatch[1].toLowerCase(),
      message: parenMatch[3],
      line,
    }
  }

  return {message: line.replace(/^.*todo:? */i, '')}
}

const UNASSIGNED = '[unassigned]'

const logChecklist = (dev, lines) => {
  if (!lines || !lines.length) {
    return
  }
  if (dev === UNASSIGNED) {
    output(`\nTODOs without an assignee: (${lines.length})`)
  } else {
    output('\nTODOs assigned to', `${dev}: (${lines.length})`)
  }
  let currentFile = null
  lines.forEach(({filePath, message, line}) => {
    if (filePath !== currentFile) {
      output(`\n  ${filePath}`)
      currentFile = filePath
    }
    const toPrint = message || line || '[Missing TODO message]'
    output(`   - ${toPrint.trim()}`)
  })
}

const run = async ({devNames, unassigned, includes, excludes, help, counts}) => {
  if (help) {
    output(`
How to use:

  Only show TODOs inside xrhome
    ./scripts/checklist.js --include reality/cloud/xrhome

  Exclude the "apps" folder:
    ./scripts/checklist.js --exclude apps

  Just christoph's TODOs:
    ./scripts/checklist.js --dev christoph

  Just TODOs that don't have an assignee:
    ./scripts/checklist.js --unassigned

  Just counts by dev:
    ./scripts/checklist.js --counts
`)
    return
  }
  try {
    const files = await listFiles(includes, excludes)

    const linesByDev = {}

    for (let i = 0; i < files.length; i++) {
      const filePath = files[i]
      // eslint-disable-next-line no-await-in-loop
      const contents = await readFile(filePath, 'utf-8')
      contents.split('\n')
        .filter(containsTodo)
        .map(parseLine)
        .forEach((parsed) => {
          const dev = parsed.dev || UNASSIGNED
          linesByDev[dev] = linesByDev[dev] || []
          linesByDev[dev].push({filePath, message: parsed.message || parsed.line})
        })
    }

    if (counts) {
      Object.entries(linesByDev).forEach(([dev, lines]) => {
        output(`${lines.length.toString().padStart(6)} ${dev}`)
      })
    } else if (unassigned) {
      logChecklist(UNASSIGNED, linesByDev[UNASSIGNED])
    } else if (devNames.length) {
      devNames.forEach(devName => logChecklist(devName, linesByDev[devName]))
    } else {
      Object.entries(linesByDev).forEach(([dev, lines]) => {
        if (dev !== UNASSIGNED) {
          logChecklist(dev, lines)
        }
      })
      logChecklist(UNASSIGNED, linesByDev[UNASSIGNED])
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  }
}

const getMultiValues = (flag) => {
  const v = []
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === flag) {
      i++
      v.push(process.argv[i])
    }
  }
  return v
}

const devNames = getMultiValues('--dev')
const unassigned = process.argv.includes('--unassigned')
const counts = process.argv.includes('--counts')
const help = process.argv.includes('--help')
const includes = getMultiValues('--include').map(p => join(p, '/'))
const excludes = getMultiValues('--exclude').map(p => join(p, '/'))

run({devNames, unassigned, help, includes, excludes, counts})
