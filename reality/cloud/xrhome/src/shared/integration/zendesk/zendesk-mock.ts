import {generateCreateMock} from '../../registry-mock'
import {IZendeskClient, Zendesk} from './zendesk-api'

const makeThrowFunction = name => (() => {
  const msg = `Called mocked ${name} without stubbing`
  // Log and throw in case there is a try/catch
  // eslint-disable-next-line no-console
  console.error(msg)
  throw new Error(msg)
})

const createZendeskMock = generateCreateMock(Zendesk)

const createZendeskClientMock = (): IZendeskClient => ({
  createTicket: makeThrowFunction('createTicket'),
  updateTicket: makeThrowFunction('updateTicket'),
  createRequest: makeThrowFunction('createRequest'),
  uploadAttachment: makeThrowFunction('uploadAttachment'),
})

export {
  createZendeskMock,
  createZendeskClientMock,
}
