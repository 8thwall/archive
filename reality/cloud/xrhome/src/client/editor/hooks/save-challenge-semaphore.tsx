import React, {createContext, useContext, useMemo} from 'react'

import {
  ChallengeHandler, ChallengeSemaphore, createChallengeSemaphore,
} from '../../common/challenge-semaphore'

type SaveSemaphoreChallenge = void
type SaveSemaphoreResponse = void
type SaveSemaphore = ChallengeSemaphore<SaveSemaphoreChallenge, SaveSemaphoreResponse>
type Handler = ChallengeHandler< SaveSemaphoreChallenge, SaveSemaphoreResponse>

const createSaveSemaphore = () => (
  createChallengeSemaphore<SaveSemaphoreChallenge, SaveSemaphoreResponse>()
)

const SaveSemaphoreContext = createContext<ReturnType<typeof createSaveSemaphore>>(null)

const useSaveSemaphoreContext = () => useContext(SaveSemaphoreContext)

const SaveSemaphoreContextProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const saveSemaphore = useMemo(createSaveSemaphore, [])
  return (
    <SaveSemaphoreContext.Provider value={saveSemaphore}>
      {children}
    </SaveSemaphoreContext.Provider>
  )
}

const useSaveSemaphore = (callback: Handler) => {
  const saveSemaphore = React.useContext(SaveSemaphoreContext)
  React.useEffect(() => {
    const id = saveSemaphore.subscribe(callback)
    return () => saveSemaphore.unsubscribe(id)
  }, [saveSemaphore, callback])
}

export type {
  SaveSemaphoreChallenge,
  SaveSemaphoreResponse,
  SaveSemaphore,
}

export {
  SaveSemaphoreContext,
  createSaveSemaphore,
  useSaveSemaphore,
  useSaveSemaphoreContext,
  SaveSemaphoreContextProvider,
}
