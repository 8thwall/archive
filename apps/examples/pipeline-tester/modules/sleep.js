// Sleep on, onUpdate to reduce the number of fps availible to the engine
const sleepModule = () => {
  let sleepSliderElem = null

  function busySleep(ms) {
    if (ms <= 0) {
      return
    }
    const e = new Date().getTime() + ms
    while (new Date().getTime() <= e) {}
  }

  // Grab a handle to the threejs scene and set the camera position on pipeline startup.
  const onStart = ({canvasWidth, canvasHeight}) => {
    sleepSliderElem = document.createElement('div')
    sleepSliderElem.style.cssText = 'position:absolute; margin: 5em 0 0 1em; background-color: white; z-index: 1; top: 130px'
    sleepSliderElem.innerHTML =
      'Sleep (ms): <br/>' +
      '<input id="sleepslider" type="range" value="0" max="100" oninput="num.value = this.value">' +
      '<output id="num">0</output>'
    document.body.insertBefore(sleepSliderElem, document.body.firstChild)
  }

  const onUpdate = ({processCpuResult}) => {
    const {reality} = processCpuResult
    if (!reality || !reality.intrinsics) {
      return
    }
    busySleep(parseInt(document.getElementById('sleepslider').value, 10))
  }

  const onDetach = () => {
    sleepSliderElem.remove()
  }

  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'sleep',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart,
    onUpdate,
    onDetach,
  }
}

export {sleepModule}
