/**
 * AwakeDetector is a hook that will run the given function without directly triggering
 * a re-render of the enclosing component.
 * It detects time skew. If an interval takes way longer than expected we assume that
 * the computer either went to sleep.
 */
import {useEffect, useRef} from 'react'

import {MILLISECONDS_PER_SECOND} from '../../shared/time-utils'

const CHECK_INTERVAL = MILLISECONDS_PER_SECOND
const SKEW_TOLERANCE = MILLISECONDS_PER_SECOND * 5

type AwakeCallback = () => void

export const useAwakeDetector = (onAwake: AwakeCallback) => {
  const functionRef = useRef<AwakeCallback>()
  // Every time component is re-rendered we have a fresh scope.
  functionRef.current = onAwake

  const tickerRef = useRef(null)
  const previousTimeRef = useRef(Date.now())

  const tick = () => {
    const past = previousTimeRef.current
    const now = Date.now()
    const diff = Math.abs(now - past)
    const slumberDetected = diff >= SKEW_TOLERANCE

    // That took way too long; assume computer was asleep.
    if (slumberDetected) {
      functionRef.current()
    }

    previousTimeRef.current = Date.now()
    tickerRef.current = setTimeout(tick, CHECK_INTERVAL)
  }

  useEffect(() => {
    tickerRef.current = setTimeout(tick, CHECK_INTERVAL)

    return () => {
      clearTimeout(tickerRef.current)
    }
  }, [])
}
