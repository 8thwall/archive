import * as React from 'react'

import {Loader} from '../ui/components/loader'

interface ExternalRedirectProps {
  url: string
}

const ExternalRedirect: React.FC<ExternalRedirectProps> = ({url}) => {
  React.useEffect(() => {
    window.location.href = url
  }, [url])

  return <Loader />
}

export {ExternalRedirect}
