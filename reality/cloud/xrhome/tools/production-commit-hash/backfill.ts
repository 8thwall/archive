import {updateHashBySpecifier, checkDiscrepancies, updateHashByUuid} from './export'

/* eslint-disable no-console */

const run = async () => {
  const {unassignedValues, mismatchedValues, needsClearAppUuids} = await checkDiscrepancies()
  console.log('unassignedValues:', unassignedValues.length, 'mismatchedValues:',
    mismatchedValues.length, 'needsClearAppUuids:', needsClearAppUuids)

  if (unassignedValues.length) {
    await Promise.all(unassignedValues.map(v => updateHashBySpecifier(v.spec, v.hash)))
    console.log('Assigned values')
  }

  if (mismatchedValues.length) {
    await Promise.all(mismatchedValues.map(v => updateHashByUuid(v.appUuid, v.expected)))
    console.log('Fixed mismatches')
  }

  if (needsClearAppUuids.length) {
    await Promise.all(needsClearAppUuids.map(uuid => updateHashByUuid(uuid, null)))
    console.log('Cleared unpublished')
  }
}

run()
