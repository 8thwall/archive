import {Notification, getErrors} from './validate'

const getLine = (error: Notification) => [
  error.type, error.file, error.message,
].join(': ')

const run = async () => {
  try {
    const [forkPoint] = process.argv.slice(2)
    const notifications = await getErrors(forkPoint ?? 'HEAD')

    notifications.forEach((error) => {
      // eslint-disable-next-line no-console
      console.log(getLine(error))
    })

    if (notifications.some(e => e.type === 'error')) {
      process.exit(1)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  }
}

run()
