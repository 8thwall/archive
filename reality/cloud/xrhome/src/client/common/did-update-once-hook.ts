import React from 'react'

/**
 * Track if a dependency has been updated.
 * @param dep The dependency to track.
 */
export const useDidUpdateOnce = (dep: any) => {
  const isUpdatedRef = React.useRef(false)
  React.useEffect(() => {
    isUpdatedRef.current = true
  }, [dep])
  return isUpdatedRef.current
}
