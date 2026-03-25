// Returns a pipeline module that initializes the threejs scene when the camera feed starts, and
// handles subsequent spawning of a glb model whenever the scene is tapped.

/* eslint-disable no-console */

export const logLifecyclePipelineModule = () => {
  const stringifyReplacer = (k, v) => (k && typeof (v) === 'object' ? '{...}' : v)

  const logName = (name) => ({detail}) => {
    console.log(`>>> ${name}`)
  }

  const logDetail = (name) => ({detail}) => {
    console.log(`>>> ${name} | ${JSON.stringify(detail)}`)
  }

  const logMethod = (name, ...args) => {
    if (!args.length) {
      console.log(`>>> ${name} [0]`)
      return
    }

    if (args.length === 1) {
      console.log(`>>> ${name} | ${JSON.stringify(args[0], stringifyReplacer)}`)
      return
    }

    console.log(`vvvvv ${name} [${args.length}] vvvvvv`)
    args.forEach(a => console.log(JSON.stringify(a, stringifyReplacer)))
    console.log(`^^^^^ ${name} [${args.length}] ^^^^^^`)
  }

  const state = {
    update: 0,
    error: 0,
  }

  const logRarely = (name, ...args) => {
    //
    // if (state.update % 100 === 1) {
    // logMethod(name, ...args)
    // }
    //
  }

  const logError = (name, ...args) => {
    if (state.error % 100 === 0) {
      logMethod(name, ...args)
    }
    state.error++
  }

  return {
    // Pipeline modules need a name. It can be whatever you want but must be unique within your app.
    name: 'loglifecycle',

    onBeforeRun: (...args) => logMethod('onBeforeRun', ...args),
    onStart: (...args) => logMethod('onStart', ...args),
    onPaused: (...args) => logMethod('onPaused', ...args),
    onResume: (...args) => logMethod('onResume', ...args),
    onException: (...args) => logError('onException', ...args),
    onDeviceOrientationChange: (...args) => logMethod('onDeviceOrientationChange', ...args),
    onCanvasSizeChange: (...args) => logMethod('onCanvasSizeChange', ...args),
    onVideoSizeChange: (...args) => logMethod('onVideoSizeChange', ...args),
    onCameraStatusChange: (...args) => logMethod('onCameraStatusChange', ...args),
    onAppResourcesLoaded: (...args) => logMethod('onAppResourcesLoaded', ...args),
    onAttach: (...args) => logMethod('onAttach', ...args),
    onDetach: (...args) => logMethod('onDetach', ...args),
    onRemove: (...args) => logMethod('onRemove', ...args),

    onProcessGpu: (...args) => {
      logRarely('onProcessGpu', ...args)
      state.update++
    },
    onProcessCpu: (...args) => logRarely('onProcessCpu', ...args),
    onUpdate: (...args) => logRarely('onUpdate', ...args),
    onRender: (...args) => logRarely('onRender', ...args),

    listeners: [
      {event: 'reality.cameraconfigured', process: logDetail('reality.cameraconfigured')},
      {event: 'reality.imageloading', process: logDetail('reality.imageloading')},
      {event: 'reality.imagescanning', process: logDetail('reality.imagescanning')},
      {event: 'reality.imagefound', process: logDetail('reality.imagefound')},
      {event: 'reality.imageupdated', process: (...args) => logRarely('reality.imageupdated', ...args)},
      {event: 'reality.imagelost', process: logDetail('reality.imagelost')},
      {event: 'reality.trackingstatus', process: logDetail('reality.trackingstatus')},
      {event: 'reality.meshfound', process: logName('reality.meshfound')},
      {event: 'reality.meshupdated', process: (...args) => logRarely('reality.meshupdated', ...args)},
      {event: 'reality.meshlost', process: logDetail('reality.meshlost')},
      {event: 'reality.projectwayspotscanning', process: logDetail('reality.projectwayspotscanning')},
      {event: 'reality.projectwayspotfound', process: logDetail('reality.projectwayspotfound')},
      {event: 'reality.projectwayspotupdated', process: (...args) => logRarely('reality.projectwayspotupdated', ...args)},
      {event: 'reality.projectwayspotlost', process: logDetail('reality.projectwayspotlost')},
      {event: 'facecontroller.cameraconfigured', process: logDetail('facecontroller.cameraconfigured')},
      {event: 'facecontroller.faceloading', process: logDetail('faceloading')},
      {event: 'facecontroller.facescanning', process: logDetail('facescanning')},
      {event: 'facecontroller.facefound', process: logDetail('facefound')},
      {event: 'facecontroller.faceupdated', process: (...args) => logRarely('faceupdated', ...args)},
      {event: 'facecontroller.facelost', process: logDetail('facelost')},
      {event: 'layerscontroller.cameraconfigured', process: logDetail('layerscontroller.cameraconfigured')},
      {event: 'layerscontroller.layerscanning', process: logDetail('layerscontroller.layerscanning')},
      {event: 'layerscontroller.layerloading', process: logDetail('layerscontroller.layerloading')},
      {event: 'layerscontroller.layerfound', process: logDetail('layerscontroller.layerfound')},
    ],
  }
}
