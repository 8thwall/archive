const pako = require('pako')

const makeBody = attributes => ({payload: Buffer.from(JSON.stringify(attributes)).toString('base64'), ...attributes})

const deflateBody = attributes => Buffer.from(pako.deflate(JSON.stringify(makeBody(attributes))))

const _fetchLog = (path, attributes) => fetch(`https://logs.8thwall.com/${path}`, {
  body: deflateBody(attributes),
  method: 'POST',
  // Ensure exactly one network request
  mode: 'no-cors',
})

export default _fetchLog
