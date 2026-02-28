import chai from 'chai'

import type {IGitFile} from '../src/client/git/g8-dto'
import {CodeSearchIndex, createCodeSearchIndex} from '../src/client/editor/code-search'

chai.should()
const {assert} = chai

// Creates a new file and sets the timestamp to the current time.
const gitFile = (
  filePath: string,
  isDirectory: boolean,
  content: string,
  timestamp: Date = new Date()
): IGitFile => ({
  repo: 'repo',
  filePath,
  isDirectory,
  mode: 0,
  timestamp,
  content,
})

describe('Empty Index', () => {
  const LIMIT = 10
  const idx: CodeSearchIndex = createCodeSearchIndex()

  it('Searches empty index', () => {
    assert.isEmpty(idx.search('a', LIMIT))
  })
  it('Updates an empty index', () => {
    idx.update([])
    assert.isEmpty(idx.search('a', LIMIT))
  })
})

describe('Searching Index', () => {
  const LIMIT = 10
  let idx: CodeSearchIndex
  let files: IGitFile[]

  beforeEach(() => {
    idx = createCodeSearchIndex()
    files = [
      gitFile('a', false, 'line a'),
      gitFile('b', false, 'line b'),
      gitFile('c', false, 'line c'),
    ]
    idx.update(files)
  })
  it('Finds a single file', () => {
    let s = idx.search('a', LIMIT)
    assert.equal(s.length, 1)
    assert.equal(s[0].lineNum, 1)
    assert.equal(s[0].filePath, files[0].filePath)
    assert.equal(s[0].line, files[0].content)

    s = idx.search('b', LIMIT)
    assert.equal(s.length, 1)
    assert.equal(s[0].lineNum, 1)
    assert.equal(s[0].filePath, files[1].filePath)
    assert.equal(s[0].line, files[1].content)

    s = idx.search('c', LIMIT)
    assert.equal(s.length, 1)
    assert.equal(s[0].lineNum, 1)
    assert.equal(s[0].filePath, files[2].filePath)
    assert.equal(s[0].line, files[2].content)
  })
  it('Finds multiple files', () => {
    const s = idx.search('n', LIMIT)
    assert.equal(s.length, 3)
    assert.equal(s[0].lineNum, 1)
    assert.equal(s[0].filePath, files[0].filePath)
    assert.equal(s[0].line, files[0].content)

    assert.equal(s[1].lineNum, 1)
    assert.equal(s[1].filePath, files[1].filePath)
    assert.equal(s[1].line, files[1].content)

    assert.equal(s[2].lineNum, 1)
    assert.equal(s[2].filePath, files[2].filePath)
    assert.equal(s[2].line, files[2].content)
  })
  it('Removes a file', () => {
    files.pop()
    idx.update(files)
    let s = idx.search('n', LIMIT)
    assert.equal(s.length, 2)

    s = idx.search('a', LIMIT)
    assert.equal(s.length, 1)
    assert.equal(s[0].lineNum, 1)
    assert.equal(s[0].filePath, files[0].filePath)
    assert.equal(s[0].line, files[0].content)

    s = idx.search('b', LIMIT)
    assert.equal(s.length, 1)
    assert.equal(s[0].lineNum, 1)
    assert.equal(s[0].filePath, files[1].filePath)
    assert.equal(s[0].line, files[1].content)

    s = idx.search('c', LIMIT)
    assert.equal(s.length, 0)
  })
  it('Adds a file', () => {
    files.push(gitFile('d', false, 'line d'))
    idx.update(files)
    let s = idx.search('n', LIMIT)
    assert.equal(s.length, 4)

    s = idx.search('d', LIMIT)
    assert.equal(s.length, 1)
    assert.equal(s[0].lineNum, 1)
    assert.equal(s[0].filePath, files[3].filePath)
    assert.equal(s[0].line, files[3].content)
  })
  it('Updates a file', () => {
    const content = 'line z'
    const timestamp = new Date()
    timestamp.setSeconds(files[0].timestamp.getSeconds() + 10)
    files[0] = gitFile(files[0].filePath, files[0].isDirectory, content, timestamp)
    idx.update(files)
    let s = idx.search('n', LIMIT)
    assert.equal(s.length, 3)

    // Do not find the original line.
    const x = idx.search('a', LIMIT)
    assert.equal(x.length, 0)

    // Finds the updated line.
    s = idx.search('z', LIMIT)
    assert.equal(s.length, 1)
    assert.equal(s[0].lineNum, 1)
    assert.equal(s[0].filePath, files[0].filePath)
    assert.equal(s[0].line, content)
  })
  it('Does not find directories', () => {
    files.push(gitFile('d', true, 'line d'))
    files.push(gitFile('d', true, 'line e'))
    assert.equal(idx.search('n', LIMIT).length, 3)
  })
  it('Finds the second line in a multi-line file', () => {
    const content = 'line d1\nline d2\nline d3'
    files.push(gitFile('d', false, content))
    idx.update(files)
    // 3 from the original 3 1-line files, 3 from this 3-line file.
    assert.equal(idx.search('line', LIMIT).length, 6)

    const s = idx.search('d2', LIMIT)
    assert.equal(s.length, 1)
    assert.equal(s[0].lineNum, 2)
    assert.equal(s[0].filePath, files[3].filePath)
    assert.equal(s[0].line, 'line d2')
  })
})
