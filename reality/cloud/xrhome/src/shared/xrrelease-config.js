const devEnv = {
  domain: 'ac.qa.8thwall.com',
}

const prodEnv = {
  domain: 'ac.8thwall.com',
}

const useProdEnv = process.env.NODE_ENV === 'production' &&
  process.env.CONSOLE_ENV !== 'dev' &&
  process.env.XRHOME_ENV !== 'Console-dev'

module.exports = Object.assign(useProdEnv ? prodEnv : devEnv, {
  // MORE methods to be added
})
