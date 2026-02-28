#!/usr/bin/env npx ts-node

// Usage:
//   > ./scripts/diff-iam-statements.ts path/to/file.json path/to/other-file.json

import {promises as fs} from 'fs'

type RawStatement = {
  Effect: 'Allow';
  Action: string | string[];
  Resource: string | string[];
  Condition?: any;
}

const expectedPropSet = new Set<string>(['Effect', 'Condition', 'Resource', 'Action', 'Sid'])

const wrapArray = <T>(v: T | T[]): T[] => (Array.isArray(v) ? v : [v])

const serializeStatements = (statements: RawStatement[]) => {
  const set = new Set<string>()
  statements.forEach((raw) => {
    if (Object.keys(raw).some(e => !expectedPropSet.has(e))) {
      throw new Error(`Unexpected fields on ${JSON.stringify(raw)}`)
    }

    if (raw.Effect !== 'Allow') {
      throw new Error(`Unexpected effect: ${raw.Effect}`)
    }

    wrapArray(raw.Resource).forEach((resource) => {
      wrapArray(raw.Action).forEach((action) => {
        const parts = [action, resource]
        if (raw.Condition) {
          parts.push(JSON.stringify(raw.Condition))
        }
        set.add(parts.join('@'))
      })
    })
  })

  return set
}

const compareSets = <T>(left: Set<T>, right: Set<T>) => {
  const onlyLeft = Array.from(left.values()).filter(e => !right.has(e))
  const onlyRight = Array.from(right.values()).filter(e => !left.has(e))
  return {onlyLeft, onlyRight, leftSize: left.size, rightSize: right.size}
}

const run = async (leftFile: string, rightFile: string) => {
  const [leftData, rightData] = (await Promise.all(
    [leftFile, rightFile].map(e => fs.readFile(e, 'utf8'))
  )).map(e => JSON.parse(e) as RawStatement[])
    .map(e => serializeStatements(e))

  const res = compareSets(leftData, rightData)

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(res, null, 2))
}

run(process.argv[2], process.argv[3])
