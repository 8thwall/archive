import type {Model, TableName} from 'sequelize'

// base on information from
// eslint-disable-next-line max-len
// https://github.com/sequelize/sequelize/blob/505467bd7fb66a0fe3298038307390c597500689/src/dialects/abstract/query-generator.js#L1255
type QueryOptions = {
  attributes?: string[]
  where?: Record<string, unknown> | number
  order?: string
  group?: string
  limit?: number
  offset?: number
}

type QueryInterface = {
  queryGenerator: {
    selectQuery: (tableName: TableName, options: QueryOptions, model?: typeof Model) => string
  }
}

export type {
  QueryInterface,
  QueryOptions,
}
