import * as ecs from '@8thwall/ecs'

const checkRequestGyro = () => typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'

const requestGyro = (world: ecs.World) => {
  if (!checkRequestGyro()) {
    return
  }
  DeviceOrientationEvent.requestPermission().then(((response) => {
    // eslint-disable-next-line no-console
    console.log('Requesting DeviceOrientationEvent Response:', response)
    const eventData = {
      granted: response === 'granted',
    }
    world.events.dispatch(
      world.events.globalId,
      'gyro-permission-response',
      eventData
    )
  })).catch(((err) => {
    // eslint-disable-next-line no-console
    console.log('Error Requesting DeviceOrientationEvent:', err)
    const eventData = {
      granted: false,
    }
    world.events.dispatch(
      world.events.globalId,
      'gyro-permission-response',
      eventData
    )
  }))
}

export {checkRequestGyro, requestGyro}
