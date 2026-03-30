// Standardizes a headers object to all lowercase to match how the node http.js module works.
// The first header to appear is what is used.
const standardizeHeaders = headers => Object.keys(headers).reduce((res, key) => {
  const keyLower = key.toLowerCase()
  if (res[keyLower] === undefined) {
    res[keyLower] = headers[key]
  }
  return res
}, {})

// Reads a header value for the given key, but ignoring case.
// Returns the first matching header.
const readStandardizedHeader = (headers, desiredKey) => {
  const desiredKeyLower = desiredKey.toLowerCase()
  const matchingKey = Object.keys(headers).find(key => key.toLowerCase() === desiredKeyLower)

  if (matchingKey) {
    return headers[matchingKey]
  } else {
    return undefined
  }
}

export {
  standardizeHeaders,
  readStandardizedHeader,
}
