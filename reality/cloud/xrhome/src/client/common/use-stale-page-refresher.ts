import {useEffect} from 'react'

import {MILLISECONDS_PER_DAY} from '../../shared/time-utils'

const TIME_UNTIL_REFRESH = 7 * MILLISECONDS_PER_DAY
const RESFRESH_TIME_MILLIS = Date.now() + TIME_UNTIL_REFRESH

/**
 * React hook which will add a 'focus' event listener on the window, then refresh the page if
 * the window is focused after 7 days of having initially loaded.
 */
const useStalePageRefresher = () => {
  const refreshIfStale = () => {
    if (Date.now() >= RESFRESH_TIME_MILLIS) {
      window.location.reload()
    }
  }

  useEffect(() => {
    window.addEventListener('focus', refreshIfStale)
    return () => window.removeEventListener('focus', refreshIfStale)
  }, [])
}

export default useStalePageRefresher
