import {generateCreateMock} from '../../registry-mock'
import {CognitoExpress} from './cognito-express-api'

const createCognitoExpressMock = generateCreateMock(CognitoExpress)
export {
  createCognitoExpressMock,
}
