import React from 'react'

const useDocumentVisibility = () => {
  const [visibility, setVisibility] = React.useState(document.visibilityState)
  React.useEffect(() => {
    const handler = () => setVisibility(document.visibilityState)
    document.addEventListener('visibilitychange', handler)
    return () => {
      document.removeEventListener('visibilitychange', handler)
    }
  }, [])

  return visibility
}

export {
  useDocumentVisibility,
}
