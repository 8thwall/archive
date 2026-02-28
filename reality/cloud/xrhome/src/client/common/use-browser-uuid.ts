import {useMemo} from 'react'
import uuid from 'uuid/v4'

const getBrowserUuid = (): string => {
  let browserUuid = localStorage.getItem('browserUuid')
  if (!browserUuid) {
    browserUuid = uuid()
    localStorage.setItem('browserUuid', browserUuid)
  }
  return browserUuid
}

const useBrowserUuid = () => useMemo(getBrowserUuid, [])

export {
  useBrowserUuid,
}
