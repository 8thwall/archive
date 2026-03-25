/* eslint-disable no-console */
/* eslint-disable max-len */

import {
  Accelerometer,
  LinearAccelerationSensor,
  Gyroscope,
  Magnetometer,
} from '../third-party/sensor-polyfills/motion-sensors.js'

declare const React: any
declare const XR8: any

const DeviceMotionView = () => {
  // Device Motion / Orientation APIs
  const [error, setError] = React.useState('')
  const [type, setType] = React.useState('')

  // Interval for acceleration (LINEAR_ACCELERATION) events.
  const [startTime, setStartTime] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [timeDiff, setTimeDiff] = React.useState(0)
  const [timeStamp, setTimeStamp] = React.useState(0)
  const [interval, setInterval] = React.useState(0)
  const [manualInterval, setManualInterval] = React.useState(0)

  const [acceleration, setAcceleration] = React.useState('')
  const [accelerationIncludingGravity, setAccelerationIncludingGravity] = React.useState('')
  const [rotationRate, setRotationRate] = React.useState('')

  // Sensor APIs
  const [sensorError, setSensorError] = React.useState('')
  const [sensorAcceleration, setSensorAcceleration] = React.useState('')
  const [sensorAccelerationIncludingGravity, setSensorAccelerationIncludingGravity] = React.useState('')
  const [sensorRotationRate, setSensorRotationRate] = React.useState('')
  const [sensorMagnetometer, setSensorMagnetometer] = React.useState('')
  const [poseStr, setPoseStr] = React.useState('')
  const [orientation, setOrientation] = React.useState({type: 'undefined', angle: undefined})

  // Used to manually compute the interval
  let firstEventTime = -1
  let numEvents = 0

  function requestPermissions() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState !== 'granted') {
            setError('DeviceMotionEvent permissions were not granted')
          }
        })
        .catch(console.error)
    }
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState !== 'granted') {
            setError('DeviceOrientationEvent permissions were not granted')
          }
        })
        .catch(console.error)
    }
  }

  const toFixedNum = (x: number) => {
    const roundedX = Math.round(x * 100) / 100
    return roundedX >= 0 ? `+${roundedX.toFixed(2)}` : roundedX.toFixed(2)
  }

  const formatEvent = ({x, y, z}) => (`x: ${toFixedNum(x)}, y: ${toFixedNum(y)}, z: ${toFixedNum(z)}`).replace(/"/g, '')

  // Device Motion APIs
  React.useEffect(() => {
    const handleMotionEvent = (evt) => {
      setType(evt.type)
      if (evt.acceleration) {
        setAcceleration(formatEvent(evt.acceleration))
      }
      if (evt.accelerationIncludingGravity) {
        setTimeStamp(evt.timeStamp)
        // NOTE(dat): on Safari evt.interval is in s, Android it is in ms. This field is not in the spec.
        setInterval(evt.interval)
        const timeNow = window.performance.now()
        setCurrentTime(timeNow)
        setTimeDiff(timeNow - startTime - evt.timeStamp)

        // Manually compute interval as well.
        if (firstEventTime === -1) {
          firstEventTime = evt.timeStamp
        }
        numEvents += 1
        setManualInterval((evt.timeStamp - firstEventTime) / numEvents)
        setAccelerationIncludingGravity(formatEvent(evt.accelerationIncludingGravity))
      }
      if (evt.rotationRate) {
        setRotationRate(
          formatEvent({
            x: evt.rotationRate.alpha,
            y: evt.rotationRate.beta,
            z: evt.rotationRate.gamma,
          })
        )
      }
    }

    const handlePoseEvent = (event) => {
      const {absolute, alpha, beta, gamma} = event
      setPoseStr(`abs=${!!absolute} alpha=${toFixedNum(alpha)} beta=${toFixedNum(beta)} gamma=${toFixedNum(gamma)}`)
    }

    setStartTime(window.performance.now())
    
    window.addEventListener('devicemotion', handleMotionEvent, true)
    window.addEventListener('deviceorientation', handlePoseEvent, true)

    const handleOrientationChange = () => {
      setOrientation({type: window.screen.orientation.type, angle: window.screen.orientation.angle})
    }
    // NOTE(dat): addEventListener 'change' doesn't work although it's part of the standard
    // https://www.w3.org/TR/screen-orientation/#example-of-usage
    if (window.screen.orientation) {
      window.screen.orientation.onchange = handleOrientationChange
    } else {
      // iOS Safari 16.3 or older uses this
      // https://caniuse.com/mdn-api_screen_orientation
      window.addEventListener('orientationchange', handleOrientationChange, true)
    }
    return () => {
      window.removeEventListener('devicemotion', handleMotionEvent, true)
      window.removeEventListener('deviceorientation', handlePoseEvent, true)
      if (window.screen.orientation) {
        window.screen.orientation.onchange = () => {}
      } else {
        window.removeEventListener('orientationchange', handleOrientationChange, true)
      }
    }
  }, [])

  // Sensor APIs
  React.useEffect(() => {
    let accelerometer = null
    let accelerometerIncludingGravity = null
    let gyroscope = null
    let magnetometer = null
    if (navigator.permissions) {
      console.log('navigator.permissions', JSON.stringify(navigator.permissions))
      Promise.all([
        navigator.permissions.query({name: 'accelerometer'}),
        navigator.permissions.query({name: 'magnetometer'}),
        navigator.permissions.query({name: 'gyroscope'}),
      ])
        .then((results) => {
          console.log('results', results, results[0], results[1], results[2])
          if (results.every(result => result.state === 'granted')) {
            try {
              accelerometer = new LinearAccelerationSensor({frequency: 60})
              accelerometer.onerror = (event) => {
                setSensorError(`LinearAccelerationSensor: ${event.error.name}`)
              }
              accelerometer.onreading = (e) => {
                setSensorAcceleration(formatEvent({x: accelerometer.x, y: accelerometer.y, z: accelerometer.z}))
              }

              accelerometerIncludingGravity = new Accelerometer({frequency: 60})
              accelerometerIncludingGravity.onerror = (event) => {
                setSensorError(`Accelerometer: ${event.error.name}`)
              }
              accelerometerIncludingGravity.onreading = (e) => {
                setSensorAccelerationIncludingGravity(formatEvent({x: accelerometerIncludingGravity.x, y: accelerometerIncludingGravity.y, z: accelerometerIncludingGravity.z}))
              }

              gyroscope = new Gyroscope({frequency: 60})
              gyroscope.onerror = (event) => {
                setSensorError(`Gyroscope: ${event.error.name}`)
              }
              gyroscope.onreading = (e) => {
                setSensorRotationRate(formatEvent({x: gyroscope.x, y: gyroscope.y, z: gyroscope.z}))
              }

              if (Magnetometer) {
                magnetometer = new Magnetometer({frequency: 60})
                magnetometer.onerror = (event) => {
                  setSensorError(`Magnetometer: ${event.error.name}`)
                }
                magnetometer.onreading = (e) => {
                  setSensorMagnetometer(formatEvent({x: magnetometer.x, y: magnetometer.y, z: magnetometer.z}))
                }
                magnetometer.start()
              }

              accelerometer.start()
              accelerometerIncludingGravity.start()
              gyroscope.start()
            } catch (e) {
              console.error(e)
              setSensorError('Error in catch: ', e.name)
            }
          } else {
            setSensorError('Permission to use sensor was denied.')
          }
        }).catch((err) => {
          setSensorError('Integration with Permissions API is not enabled.')
        })
    } else {
      setSensorError('No Permissions API.')
    }

    return () => {
      if (accelerometer) {
        accelerometer.stop()
      }
      if (accelerometerIncludingGravity) {
        accelerometerIncludingGravity.stop()
      }
      if (gyroscope) {
        gyroscope.stop()
      }
      if (magnetometer) {
        magnetometer.stop()
      }
    }
  }, [])

  const manualTime = currentTime - startTime

  const hotLoop = (count = 100000000) => {
    let ret = 0
    for (let i = 0; i < count; i++) {
      ret += i
    }
    return ret
  }

  return (
    <div className='container'>
      <button onClick={() => hotLoop()}>Hot CPU Spin</button>
      <h1>Device Orientation</h1>
      <p>Angle {orientation.angle}</p>
      <p>Type {orientation.type}</p>

      <h1>Device Motion APIs</h1>
      <button onClick={requestPermissions}>Request Permissions</button>
      <p>{error}</p>
      <p>type: {type}</p>
      <p>timeStamp: {timeStamp.toFixed(6)}ms</p>
      <p>manual timeStamp: {manualTime.toFixed(6)}ms</p>
      <p>LinAcceleration time diff: {timeDiff.toFixed(6)}ms</p>
      <p>LinAcceleration interval: {interval}ms - {(1000.0 / interval).toFixed(6)}hz</p>
      <p>LinAcceleration manually computed interval: {manualInterval.toFixed(6)}ms - {(1000.0 / manualInterval).toFixed(6)}hz</p>
      <p>LinAcceleration: <pre>{acceleration}</pre></p>
      <p>Accelerometer: <pre>{accelerationIncludingGravity}</pre></p>
      <p>Gyroscope: <pre>{rotationRate}</pre></p>
      <p>DevicePose: <pre>{poseStr}</pre></p>


      <h1>Sensor APIs</h1>
      <p>{sensorError}</p>
      <p>LinAccelerometer: {sensorAcceleration}</p>
      <p>Accelerometer: {sensorAccelerationIncludingGravity}</p>
      <p>Gyroscope: {sensorRotationRate}</p>
      <p>Magnetometer: {sensorMagnetometer}</p>
    </div>
  )
}

export {DeviceMotionView}
