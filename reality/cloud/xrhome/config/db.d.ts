import type {Options} from 'sequelize'

type DbEnv = 'dev' | 'development' | 'local' | 'production' | 'test' | 'test-local-pg'
type OptionsCallback = (error: Error | null, options: Options | null) => void

/* eslint-disable no-redeclare */
declare function config(): Options
declare function config(env: DbEnv): Options
declare function config(callback: OptionsCallback): void
/* eslint-enable no-redeclare */

export default config
