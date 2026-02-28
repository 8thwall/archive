import {useEffect, useRef} from 'react'

type NetworkDetectorCallback = (online: boolean) => void

/**
 * This hook runs the given function when the browser detects that a network connection has been
 * established or lost. Passes a boolean to indicate whether network came online.
 * @param onNetworkChange
 */
export const useNetworkDetector = (onNetworkChange: NetworkDetectorCallback) => {
  const functionRef = useRef<NetworkDetectorCallback>()
  functionRef.current = onNetworkChange

  useEffect(() => {
    const handleOnline = () => functionRef.current(true)
    const handleOffline = () => functionRef.current(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
}
