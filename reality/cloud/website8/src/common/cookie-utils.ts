const getDocumentCookies = () => document.cookie.split('; ').reduce((acc, currentValue) => {
  const [key, value] = currentValue.split('=')
  acc[key] = value
  return acc
}, {})

const setCookie = (name: string, value: string) => {
  const encodedVal = encodeURIComponent(value)
  document.cookie = `${name}=${encodedVal}`
}

export {
  getDocumentCookies,
  setCookie,
}
