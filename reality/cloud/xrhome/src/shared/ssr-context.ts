import {createContext} from 'react'

interface ISsrContext {
  setTitle: (newTitle: string) => void
}

const SsrContext = createContext<ISsrContext>(null)

export {
  SsrContext,
}
