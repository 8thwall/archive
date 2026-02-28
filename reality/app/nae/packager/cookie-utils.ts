import type {DevCookie} from '@nia/reality/shared/nae/nae-types'

const cookieToString = (cookie?: DevCookie) => {
  if (!cookie) {
    return ''
  }

  const {name, token, options} = cookie
  const nameString = `${name}=${token}`
  const optionsString = Object.entries(options)
    .map(([key, value]) => {
      if (key === 'expires' && value instanceof Date) {
        return `${key}=${value.toUTCString()}`
      }
      return `${key}=${value}`
    })
    .join('; ')

  return `${nameString}; ${optionsString}`
}

export {
  cookieToString,
}
