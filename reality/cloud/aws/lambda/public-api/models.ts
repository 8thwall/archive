import type {IDb} from '@nia/reality/cloud/xrhome/src/shared/integration/db/db-api'

let registeredModels: IDb

const register = (models) => {
  registeredModels = models
}

const use = () => {
  if (!registeredModels) {
    throw new Error('Unregistered models')
  }
  return registeredModels
}

export {
  register,
  use,
}
