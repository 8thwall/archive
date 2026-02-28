import React from 'react'

import {makeRunQueue} from '@nia/reality/shared/run-queue'

// Allocate a run queue on mount for the lifetime of the component`
const useRunQueue = () => React.useState(makeRunQueue)[0]

export {
  useRunQueue,
}
