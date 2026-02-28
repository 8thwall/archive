import {registerComponent} from './registry'
import {boolean, string} from './types'

const GpsPointer = registerComponent({
  name: 'gps-pointer',
  schema: {
    faceGpsDirection: boolean,
    idleClip: string,
    walkClip: string,
    runClip: string,
    driveClip: string,
  },
  schemaDefaults: {
    faceGpsDirection: true,
    idleClip: '',
    walkClip: '',
    runClip: '',
    driveClip: '',
  },
})

export {
  GpsPointer,
}
