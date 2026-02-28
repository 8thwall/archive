import base64 from 'base-64'

const encode = obj => (
  base64.encode(encodeURI(JSON.stringify(obj)).replace(/%5B/g, '[').replace(/%5D/g, ']'))
)

const decode = obj => (
  JSON.parse(decodeURI(base64.decode(obj)))
)

export {encode, decode}
