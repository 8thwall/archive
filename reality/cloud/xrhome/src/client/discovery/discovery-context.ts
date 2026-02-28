import {createContext} from 'react'

interface IDiscoveryContext {
  pageName: string
}

const DiscoveryContext = createContext<IDiscoveryContext>(null)

export {
  DiscoveryContext,
}
