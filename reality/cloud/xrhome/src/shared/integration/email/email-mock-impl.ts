import type {EmailClient} from './email-api'

const makeThrowFunction = name => (() => {
  const msg = `Called mocked ${name} without stubbing`
  // Log and throw in case there is a try/catch
  // eslint-disable-next-line no-console
  console.error(msg)
  throw new Error(msg)
})

const createEmailMockClient = (): EmailClient => ({
  sendEmail: makeThrowFunction('sendEmail'),
})

export {
  createEmailMockClient,
}
