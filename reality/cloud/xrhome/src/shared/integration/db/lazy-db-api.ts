import {lazyEntry} from '../../registry'
import type {IDb} from './db-api'

const LazyDb = lazyEntry<IDb>('lazy-db')

export {
  LazyDb,
}
