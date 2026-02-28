import {createDb} from './db-impl'

const createSqliteTestDb = () => createDb({
  username: 'postgres',
  password: 'foo',
  database: 'xrhome_test',
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
})

export {
  createSqliteTestDb,
}
