#!/usr/bin/env npx ts-node

// Usage:
//   > ./scripts/fix-aws-arrays.ts path/to/file.json
//   > cat path/to/file.yaml | yq eval -j | /scripts/fix-aws-arrays.ts

import fs from 'fs'

const STDIN = 0  // Node is weird

const fixObject = (value: Record<string, any>) => {
  const keys = Object.keys(value)

  if (keys.length === 1 && value.Quantity === 0) {
    return []
  }
  if (value.Items && value.Quantity && keys.length === 2) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return fixValue(value.Items)
  } else {
    const res = {}
    keys.forEach((k) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      res[k] = fixValue(value[k])
    })
    return res
  }
}

const fixValue = (value: any) => {
  if (typeof value !== 'object' || value === null) {
    return value
  } else if (Array.isArray(value)) {
    return value.map(fixValue)
  } else {
    return fixObject(value)
  }
}

const run = (inputFile?: string) => {
  const data = fs.readFileSync(inputFile || STDIN, 'utf8')
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(fixValue(JSON.parse(data)), null, 2))
}

run(process.argv[2])
