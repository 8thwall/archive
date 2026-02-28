import {normalize, schema} from 'normalizr'

const account = new schema.Entity('Accounts', {},
  {
    idAttribute: 'uuid',
  })
const app = new schema.Entity('Apps',
  {
    Account: account,
  },
  {
    idAttribute: 'uuid',
  })

account.define({
  Apps: new schema.Array(app),
})

const makeNormalizer = schemaEntity => data => normalize(data, schemaEntity)

// use normalizeApp if you get your data from a db.App query
const normalizeApp = makeNormalizer(app)
// use normalizeApp if you get your data from a db.Account query
const normalizeAccount = makeNormalizer(account)

const mapKV = (arr, fromField, toField) => arr.reduce((o, v) => {
  o[v[fromField]] = v[toField]
  return o
}, {})

type IndexUpdates = {
  accountByName?: {}
  appByName?: {}
}

const generateIndexUpdates = (normalizedData) => {
  const indexUpdates: IndexUpdates = {}
  if (normalizedData.entities.Accounts) {
    indexUpdates.accountByName = mapKV(
      Object.values(normalizedData.entities.Accounts), 'shortName', 'uuid'
    )
  }
  if (normalizedData.entities.Apps) {
    indexUpdates.appByName = mapKV(Object.values(normalizedData.entities.Apps), 'appName', 'uuid')
  }

  return indexUpdates
}

export {
  normalizeApp,
  normalizeAccount,
  generateIndexUpdates,
}
