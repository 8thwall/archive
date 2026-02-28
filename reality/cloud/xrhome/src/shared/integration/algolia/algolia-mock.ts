import {Algolia} from './algolia-api'
import {generateCreateMock} from '../../registry-mock'

const createAlgoliaMock = generateCreateMock(Algolia)

export {
  createAlgoliaMock,
}
