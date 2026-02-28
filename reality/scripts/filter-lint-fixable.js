#!/usr/bin/env node

/* eslint-disable no-console */

// Takes a list of filenames from stdin and prints the ones that can be autofixed to stdout

const readline = require('readline')
const {execSync} = require('child_process')
const {readFileSync} = require('fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

rl.on('line', (filename) => {
  if (!filename.match(/\.[tj]sx?$/)) {
    return
  }

  let [lineCount, , characterCount] = execSync(`wc ${filename}`).toString().split(' ').filter(e => e)

  lineCount = Number(lineCount)
  characterCount = Number(characterCount)

  if (lineCount > 10000 || characterCount > 100000 || characterCount / (lineCount + 1) > 150) {
    console.warn(`Lint check skipped for file ${filename}, lines: ${lineCount}, characters: ${characterCount}`)
    return
  }

  let resultJson
  try {
    resultJson = execSync(`eslint ${filename} --cache --fix-dry-run --format=json`)
  } catch (err) {
    [, resultJson] = err.output
  }

  try {
    const [results] = JSON.parse(resultJson.toString())

    if (!results.source) {
      return
    }

    const fileContents = readFileSync(filename).toString()

    if (fileContents !== results.source) {
      console.log(filename)
    }
  } catch (err) {
    console.warn('Failed to parse eslint output for', filename)
  }
})
