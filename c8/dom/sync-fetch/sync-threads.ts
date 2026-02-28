import {Worker, workerData} from 'worker_threads'
import v8 from 'v8'

const INT32_BYTES = 4
const SHARED_METADATA_SIZE = INT32_BYTES

const createSyncFn = (filename: string, bufferSize = 64 * 1024) => {
  const sharedBuffer = new SharedArrayBuffer(bufferSize)
  const semaphore = new Int32Array(sharedBuffer)
  return (inputData = {}) => {
    // Reset the semaphore
    Atomics.store(semaphore, 0, 0)

    const worker = new Worker(filename, {
      workerData: {
        inputData,
        sharedBuffer,
        internalStoragePath: (globalThis as any).__niaInternalStoragePath,
        naeBuildMode: (globalThis as any).naeBuildMode,
      },
    })

    // Stop execution until the worker updates the semaphore
    Atomics.wait(semaphore, 0, 0)

    const length = semaphore[0]

    if (length < 0 || length > bufferSize - SHARED_METADATA_SIZE) {
      throw new Error(`Worker(${worker})`)
    }

    worker.terminate()

    return v8.deserialize(new Uint8Array(sharedBuffer, SHARED_METADATA_SIZE, length))
  }
}

const notifyParent = (sharedBuffer: SharedArrayBuffer, data: any, error: Error | null) => {
  const buf = v8.serialize(data)

  // Reserve space for the length of the buffer
  buf.copy(new Uint8Array(sharedBuffer), SHARED_METADATA_SIZE)

  const semaphore = new Int32Array(sharedBuffer)

  // Store the length of the buffer as the first element
  Atomics.store(semaphore, 0, error ? -buf.length : buf.length)
  Atomics.notify(semaphore, 0)
}

const runAsWorker = async <Arg, Res>(workerAsyncFn: (arg: Arg) => Promise<Res>) => {
  const {inputData, sharedBuffer} = workerData

  try {
    notifyParent(sharedBuffer, await workerAsyncFn(inputData), null)
  } catch (err) {
    notifyParent(sharedBuffer, null, err)
  }
}

export {createSyncFn, runAsWorker}
