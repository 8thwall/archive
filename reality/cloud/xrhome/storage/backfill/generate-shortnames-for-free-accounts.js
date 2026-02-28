// This file generates random shortNames for all accounts that do not currently have one
// It is a one-time back-fill applied in September 2019
// This back-fill only sets the field in the Accounts table, a future back-fill will migrate this
// data to the AccountShortNames table

const db = require('../schema')
const {Op} = require('sequelize')

const zip = (a1, a2) => a1.map((x, i) => [x, a2[i]])

const generateShortName = () => {
  const chars = 'abcdefghijkmnpqrstuvwxyz'
  // This originally generated short names with prepended f0
  return ((process.env.NODE_ENV !== 'production' ? 'test_' : '') +
    new Array(8).fill(1).map(_ => chars.charAt(Math.floor(Math.random() * chars.length))).join(''))
}

const shortNamesForAll = async (save) => {
  const transaction = await db.sequelize.transaction()

  try {
    const accountsWithMissingShortNames = await db.Account.findAll({
      where: {
        shortName: null,
      },
      transaction,
    })
    const numMissing = accountsWithMissingShortNames.length

    const generated = new Set()
    while (generated.size < numMissing) {
      generated.add(generateShortName())
    }

    // Quick sanity check
    const conflictingRows = await db.Account.count({
      where: {
        shortName: {[Op.in]: generated},
      },
      transaction,
    })
    if (conflictingRows) {
      throw new Error(`Generated names conflict with ${conflictingRows} rows`)
    }

    const zipped = zip(accountsWithMissingShortNames, Array.from(generated))

    await Promise.all(zipped.map((pair) => {
      const [account, shortName] = pair
      console.log(`Assigning ${shortName} to ${account.uuid}`)
      account.shortName = shortName
      return save ? account.save({transaction}) : Promise.resolve()
    }))

    await transaction.commit()
    console.log(`Updated ${numMissing} accounts without a shortName${!save ? ' (dry run)' : ''}`)
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

const remove_f0 = async (save) => {
  const transaction = await db.sequelize.transaction()

  try {
    const candidateAccounts = await db.Account.findAll({
      where: {
        accountType: 'UnityDeveloper',
        shortName: {
          [Op.and]: [
            {[Op.not]: '8wxr'},
            {[Op.like]: 'f0%'},
          ],
        },
      },
      transaction,
    })

    const allAccountsWithPrefix = await db.Account.count({
      where: {
        shortName: {
          [Op.like]: 'f0%',
        },
      },
      transaction,
    })

    if (candidateAccounts.length !== allAccountsWithPrefix) {
      throw new Error(`Found ${candidateAccounts.length} candidate XR Developer but ${allAccountsWithPrefix} total accounts start with f0`)
    }

    const generated = new Set()
    while (generated.size < candidateAccounts.length) {
      generated.add(generateShortName())
    }

    const zipped = zip(candidateAccounts, Array.from(generated))

    await Promise.all(zipped.map(([account, shortName]) => {
      account.shortName = shortName
      console.log(`Assigning ${shortName} to ${account.uuid}`)
      return save ? account.save({transaction}) : Promise.resolve()
    }))

    await transaction.commit()
    console.log(`Regenerated shortNames for ${candidateAccounts.length} accounts${!save ? ' (dry run)' : ''}`)
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

module.exports = {
  shortNamesForAll,
}

if (require.main === module) {
  const save = !process.argv.find(arg => arg === '--dry-run')
  shortNamesForAll(save).then(() => remove_f0(save).then(() => process.exit(0)))
    .catch((err) => {
      console.error(err)
      process.exit(1)
  })
}
