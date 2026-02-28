import {checkDiscrepancies} from './export'

/* eslint-disable no-console */

const run = async () => {
  const results = await checkDiscrepancies()
  console.log(results)
}

run()
