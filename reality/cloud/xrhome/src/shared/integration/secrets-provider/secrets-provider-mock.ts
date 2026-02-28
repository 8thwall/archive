import {generateCreateMock} from '../../registry-mock'
import {SecretsProvider} from './secrets-provider-api'

const createSecretsProviderMock = generateCreateMock(SecretsProvider)

export {
  createSecretsProviderMock,
}
