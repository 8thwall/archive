
import CALIBR8 from 'apps/client/calibratejs/calibrate-wasm'

const calibr8Promise = CALIBR8()

const calibrateProcessModule = () => {
  const minTimeBetweenInMs = 2000
  let calibr8 = null
  let lastResult = null
  let currDate = new Date()
  let lastCheckTime = currDate.getTime()
  let isFirstFrame = true
  let calibrationFinished = false
  calibr8Promise.then((module) => {
    calibr8 = module
  })
  return {
    name: 'calibrateprocess',
    onProcessCpu: ({processGpuResult}) => {
      const {camerapixelarray} = processGpuResult
      if (!calibr8 || !camerapixelarray || !camerapixelarray.pixels) {
        return {
          didCheck: false,
          calib: lastResult,
          calibrationFinished,
          currDate,
          lastCheckTime,
          minTimeBetweenInMs,
        }
      }
      const {rows, rowBytes, cols, pixels} = camerapixelarray

      currDate = new Date()
      let didCheck = false
      if ((currDate.getTime() - lastCheckTime >= minTimeBetweenInMs && !calibrationFinished) ||
        isFirstFrame) {
        const ptr = calibr8._malloc(rows * rowBytes)
        new Uint8Array(calibr8.HEAPU8.buffer, ptr, rows * rowBytes).set(pixels)
        calibrationFinished = calibr8._c8EmAsm_processCalibrationFrame(rows, cols, rowBytes, ptr)
        calibr8._free(ptr)
        lastCheckTime = currDate.getTime()
        didCheck = true
        lastResult = window.calib
        delete window.calib
      }

      isFirstFrame = false

      return {
        didCheck,
        calib: lastResult,
        calibrationFinished,
        currDate,
        lastCheckTime,
        minTimeBetweenInMs,
      }
    },
  }
}

export {
  calibrateProcessModule,
}
