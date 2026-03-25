// Visualizes the acceleration of the user's phone.  Can be used for determining if the user is
// moving at an appropriate speed for scale estimation.

// Both of these two configuration options should be tuned.  Increasing them will typically make the
// displayed linear acceleration smoother but perhaps more laggy.
// This determines how many accelerations we store in our queue that we will smooth.
const MAX_ACCELERATIONS_QUEUE_SIZE = 30
// How much we smooth using our gaussian filter.  The higher the number, the more smoothed the
// in the accelerations queue will be.
const GAUSSIAN_SIGMA = 11.0

const gaussKernel = (sigma, kernelWindow) => {
  const width = Math.floor(kernelWindow / 2)
  const norm = 1.0 / (sigma * Math.sqrt(2.0 * Math.PI))
  const coefficient = -2.0 * sigma * sigma
  let sum = 0.0
  const kernel = []
  for (let i = 0; i < width * 2 + 1; ++i) {
    const x = i - width
    const val = norm * Math.exp(x * (x / coefficient))
    kernel.push(val)
    sum += val
  }

  // Divide by total to make sure the sum of all the values is equal to 1.
  for (let i = 0; i < kernel.length; ++i) {
    kernel[i] /= sum
  }
  return kernel
}

const gaussianFilter = (values, sigma, kernelWindow) => {
  const kernel = gaussKernel(sigma, kernelWindow)
  const out = []
  const width = (kernel.length - 1) / 2
  for (let i = 0; i < values.length; ++i) {
    let sample = 0.0
    let kernelSum = 0.0
    for (let j = i - width; j <= i + width; ++j) {
      if (j >= 0 && j < values.length) {
        const kernelIdx = width + (j - i)
        sample += kernel[kernelIdx] * values[j]
        kernelSum += kernel[kernelIdx]
      }
    }
    // Can either zero pad the border, resize kernel, or hallucinate out-of-bounds values. Here we
    // zero pad the border and normalize based on how much of the kernel we used.
    // Note if this becomes slow we can optimize by avoiding the add + divide ops in regions of the
    // loop where kernelSum is expected to be 1.
    out.push(sample / kernelSum)
  }
  return out
}

// Get the l2 norm of the linear acceleration event.  The l2 norm is the square root of the inner
// product of itself.
const l2Norm = linAcc => Math.sqrt((linAcc.x * linAcc.x) + (linAcc.y * linAcc.y) + (linAcc.z * linAcc.z))

const accelerationsModule = () => {
  // Holds the latest N accelerations.
  const accL2Queue_ = []
  let accelDisplayElem_ = null

  const addAcceleration = (event) => {
    const acc = event.acceleration
    // console.log('Hit addAcceleration with data: ', acc)

    accL2Queue_.push(l2Norm(acc))
    const smoothed = gaussianFilter(accL2Queue_, GAUSSIAN_SIGMA, MAX_ACCELERATIONS_QUEUE_SIZE)

    if (accL2Queue_.length === MAX_ACCELERATIONS_QUEUE_SIZE) {
      // Take the middle element from the smoothed accelerations.  This is using -3 because it
      // was smoother.
      const displayedAcceleration = smoothed[MAX_ACCELERATIONS_QUEUE_SIZE - 3]
      accelDisplayElem_.innerHTML = (
        `Latest Accel: Pos: ${acc.x.toFixed(2)}x, ${acc.y.toFixed(2)}y, ${acc.z.toFixed(2)}z ` +
        `<br /> Smoothed L2: ${displayedAcceleration.toFixed(2)}`
      )
      // Remove the earliest item from the queue.
      accL2Queue_.shift()
    }
  }

  // Grab a handle to the threejs scene and set the camera position on pipeline startup.
  const onStart = ({canvasWidth, canvasHeight}) => {
    accelDisplayElem_ = document.createElement('div')
    accelDisplayElem_.style.cssText = (
      'position:absolute; margin: 12em 0 0 1em; background-color: white; z-index: 1;')
    document.body.insertBefore(accelDisplayElem_, document.body.firstChild)

    window.addEventListener('devicemotion', addAcceleration, true)
  }

  const onUpdate = ({processCpuResult}) => {

  }

  const onDetach = () => {
    accelDisplayElem_.remove()
  }

  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'accelerations',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart,
    onUpdate,
    onDetach,
  }
}

export {accelerationsModule}
