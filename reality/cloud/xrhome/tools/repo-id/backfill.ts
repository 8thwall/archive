import {updateRepoIdByUuid} from './db'
import {checkDiscrepancies} from './export'

/* eslint-disable no-console */

const run = async () => {
  const {appsWithMissingRepoId} = await checkDiscrepancies()

  const appsToBackfill = appsWithMissingRepoId
  if (appsToBackfill.length) {
    console.log('Filling repoId for', appsToBackfill.length, 'apps...')
    await Promise.all(
      appsToBackfill.map(v => updateRepoIdByUuid(v.uuid, v.repoId))
    )
    console.log('Backfilled missing values')
  }
}

run()
