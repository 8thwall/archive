import {generateCreateMock} from '../../registry-mock'
import {SFN} from './sfn-api'

const createSfnMock = generateCreateMock(SFN)

export {
  createSfnMock,
}
