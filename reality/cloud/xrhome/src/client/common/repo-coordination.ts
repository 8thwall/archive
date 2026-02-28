// Keeps track of dirty bits set for repositories.
// A repo is "dirty" if a separate tab in the same browser edits the same project
// And writes to IndexedDB. The bit is set until we sync from IndexedDB.
import {postRepoBroadcastMessage} from './repo-broadcast'
import {
  MILLISECONDS_PER_SECOND,
} from '../../shared/time-utils'

const dirtyBits: Record<string, boolean> = {}
const writeBlocks: Record<string, string> = {}
const clearTimeouts: Record<string, ReturnType<typeof setTimeout>> = {}
const writeIntervals: Record<string, ReturnType<typeof setInterval>> = {}

const SEND_RUNNING_WRITE_INTERVAL_MILLIS = 500
const CLEAR_WRITE_BLOCK_TIMEOUT = MILLISECONDS_PER_SECOND * 5
const DEFAULT_WAIT_TIMEOUT = MILLISECONDS_PER_SECOND * 10
const DIRTY_BIT_CHECK_INTERVAL_MILLIS = 100

const sleep = timeoutMs => new Promise(resolve => setTimeout(resolve, timeoutMs))

// Sets the block bit for CLEAR_WRITE_BLOCK_TIMEOUT seconds and dirty bit indefinitely.
// Timeout is in case of other tab closing/crashing before completing operation.
// Prevents us from dead locking. We expect clearRepositoryWriteBlock to be called before
// we reach the timeout condition. Not receiving end-write-block before timeout of the last
// run-write-block indicates a possible error in the writing tab.
const setRepositoryWriteBlock = (repositoryName: string, blockingActionName: string) => {
  if (!blockingActionName) {
    throw new Error('Missing blockingActionName in call to setRepositoryWriteBlock.')
  }
  dirtyBits[repositoryName] = true
  writeBlocks[repositoryName] = blockingActionName
  if (clearTimeouts[repositoryName]) {
    clearTimeout(clearTimeouts[repositoryName])
  }
  clearTimeouts[repositoryName] = setTimeout(() => {
    // NOTE (pawel) It is possible but unlikely that another tab is still running the operation
    // but its event loop is saturated (slow machines and/or high cpu usage) or that the tab was
    // closed before it sent the end write message. In either case, we consider the block released.
    writeBlocks[repositoryName] = null
  }, CLEAR_WRITE_BLOCK_TIMEOUT)
}

const clearRepositoryWriteBlock = (repositoryName: string) => {
  writeBlocks[repositoryName] = null
  if (clearTimeouts[repositoryName]) {
    clearTimeout(clearTimeouts[repositoryName])
    delete clearTimeouts[repositoryName]
  }
}

const clearRepositoryDirtyBit = (repositoryName: string) => {
  dirtyBits[repositoryName] = false
}

const waitForRepositoryWriteBlock = async (
  repositoryName: string,
  blockedActionName: string
) => {
  if (writeBlocks[repositoryName] && !dirtyBits[repositoryName]) {
    throw new Error(`Write block is set for ${writeBlocks[repositoryName]} but dirty bit is not.`)
  }

  if (!dirtyBits[repositoryName]) {
    return false  // No other tab wrote before us.
  }

  const endTime = performance.now() + DEFAULT_WAIT_TIMEOUT
  while (writeBlocks[repositoryName]) {
    const now = performance.now()
    if (now >= endTime) {
      throw new Error(`\
Write block on ${blockedActionName} timed out before receiving end-write-block notification \
on ${writeBlocks[repositoryName]}.\
`)
    }
    // eslint-disable-next-line no-await-in-loop
    await sleep(DIRTY_BIT_CHECK_INTERVAL_MILLIS)
  }
  return true  // Some other tab made changes.
}

const beginWriteOperation = async (repositoryName: string, actionName: string) => {
  if (!actionName) {
    throw new Error('Missing actionName in call to beginWriteOperation.')
  }
  if (writeIntervals[repositoryName]) {
    throw new Error(`Unexpected beginWriteOperation for ${actionName} before an endWriteOperation`)
  }
  await postRepoBroadcastMessage(repositoryName, {
    type: 'begin-write-operation',
    actionName,
  })
  writeIntervals[repositoryName] = setInterval(async () => {
    await postRepoBroadcastMessage(repositoryName, {
      type: 'run-write-operation',
      actionName,
    })
  }, SEND_RUNNING_WRITE_INTERVAL_MILLIS)
}

const endWriteOperation = async (repositoryName: string, actionName: string) => {
  if (!actionName) {
    throw new Error('Missing actionName in call to endWriteOperation.')
  }
  if (!writeIntervals[repositoryName]) {
    throw new Error(`Unexpected endWriteOperation for ${actionName} before beginWriteOperation.`)
  }
  clearInterval(writeIntervals[repositoryName])
  delete writeIntervals[repositoryName]
  await postRepoBroadcastMessage(repositoryName, {
    type: 'end-write-operation',
    actionName,
  })
}

export {
  setRepositoryWriteBlock,
  clearRepositoryWriteBlock,
  clearRepositoryDirtyBit,
  waitForRepositoryWriteBlock,
  beginWriteOperation,
  endWriteOperation,
}
