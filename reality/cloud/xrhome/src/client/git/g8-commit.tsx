import type {DeepReadonly} from 'ts-essentials'

import {timeSince} from '../common/time-since'
import type {IG8Commit} from './g8-dto'

const getCommitFromLogs = (hash: string, logs: DeepReadonly<IG8Commit[]>) => (
  logs.find(l => l.id === hash)
)

const getTruncatedHash = (hash: string) => hash && hash.substring(0, 7)

const getCommitHashString = (log: IG8Commit) => log && getTruncatedHash(log.id)

const getCommitTimeString = (log: IG8Commit, showDays: boolean = false) => {
  if (!log || !log.signature || !log.signature.when) {
    return ''
  }
  return `${timeSince(log.signature.when, showDays)} ago`
}

export {
  getCommitFromLogs,
  getTruncatedHash,
  getCommitHashString,
  getCommitTimeString,
}
