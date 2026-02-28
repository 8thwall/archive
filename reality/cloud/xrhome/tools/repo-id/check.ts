import {checkDiscrepancies} from './export'

/* eslint-disable no-console */

const MAX_PRINTED_ARRAY = Number(process.env.MAX_PRINTED_ARRAY ?? 10)
const prettyPrintStringArray = (array: any[]) => {
  if (array.length <= MAX_PRINTED_ARRAY) {
    return array
  } else {
    return {fullLength: array.length, preview: array.slice(0, MAX_PRINTED_ARRAY)}
  }
}

const run = async () => {
  const results = await checkDiscrepancies()

  Object.entries(results).forEach(([name, value]) => {
    console.log(name, JSON.stringify(prettyPrintStringArray(value), null, 2))
  })
}

run()
