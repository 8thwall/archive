import {MILLISECONDS_PER_SECOND} from '@nia/reality/cloud/xrhome/src/shared/time-utils'

const requestTimeEpochToUnixTime = (timeEpoch: number) => timeEpoch / MILLISECONDS_PER_SECOND

export {requestTimeEpochToUnixTime}
