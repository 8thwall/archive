#!/usr/bin/env npx ts-node

// Usage:
//   > ./scripts/flatten-json.ts path/to/file.json
//   > cat path/to/file.yaml | yq eval -j | ./scripts/flatten-json.ts

import fs from 'fs'

import {flattenObject} from './lib/flatten'

const STDIN = 0  // Node is weird

const run = (inputFile?: string) => {
  const data = fs.readFileSync(inputFile || STDIN, 'utf8')
  const entries = flattenObject(JSON.parse(data))
  // eslint-disable-next-line no-console
  console.log(entries.map(b => `${b.key}: ${b.value}`).join('\n'))
}

run(process.argv[2])
