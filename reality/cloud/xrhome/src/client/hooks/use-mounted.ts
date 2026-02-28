import React from 'react'

const useMountedRef = () => {
  const ref = React.useRef(true)
  React.useEffect(() => {
    ref.current = true
    return () => {
      ref.current = false
    }
  }, [])
  return ref
}

export {
  useMountedRef,
}
