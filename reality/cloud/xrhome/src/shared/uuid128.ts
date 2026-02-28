import Long from 'long'

import type {MathTypes} from './integration/vps/proto/MathTypes'

const bytesToHexString = (byteArray: number[]) => (
  // eslint-disable-next-line prefer-template, no-bitwise
  Array.from(byteArray, byte => (byte & 0xFF).toString(16).padStart(2, '0')).join('')
)

const uuidToHex = (uuid: MathTypes.UUID) => {
  const {upper, lower} = uuid
  const upperLong = Long.fromString(upper, true)  // unsigned
  const lowerLong = Long.fromString(lower, true)  // unsigned
  return `${bytesToHexString(upperLong.toBytesLE())}${bytesToHexString(lowerLong.toBytesLE())}`
    .toUpperCase()
}

export {uuidToHex}
