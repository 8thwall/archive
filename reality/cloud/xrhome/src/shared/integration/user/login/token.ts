import crypto from 'crypto'
import baseX from 'base-x'

const base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

const generateLoginToken = (): string => crypto.randomUUID()

const encodeLoginToken = (token: string) => base62.encode(Buffer.from(token))

const decodeLoginToken = (encodedToken: string) => base62.decode(encodedToken).toString()

export {
  generateLoginToken,
  encodeLoginToken,
  decodeLoginToken,
}
