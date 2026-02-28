import {generateCreateMock} from '../../registry-mock'
import {AssetsApi} from './assets-api'

const createAssetsApiMock = generateCreateMock(AssetsApi)

export {
  createAssetsApiMock,
}
