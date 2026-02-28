import * as capnp from 'capnp-ts'

import {dispatchify} from 'c8/webapp/dispatchify'
import type {DispatchifiedActions} from 'c8/webapp/dispatchify-types'
import {fetchJson} from 'c8/webapp/fetch'

const {RecorderFactory} = window.Recorder8

type ReportFunc = (id: number) => void
interface WorkerReport {
  success: ReportFunc
  error: ReportFunc
}

const worker = new Worker('/container/recorder-worker-min.js')
const workerReport: WorkerReport = {
  success: () => {},
  error: () => {},
}
worker.onmessage = (e) => {
  const {id, status} = e.data
  if (status === 200) {
    workerReport.success(id)
  } else {
    workerReport.error(id)
  }
}

let Recorder8 = null
async function loadRecorder8() {
  if (Recorder8 === null) {
    Recorder8 = await RecorderFactory()
  }
  return Recorder8
}

let mediaRecorder_: MediaRecorder | null = null
let dataChunks_: Blob[] = []
const mp4ById_: Record<number, Blob> = {}

type CapnpChunk = {
  message: ArrayBuffer
}
const capnpChunksById_: Record<number, CapnpChunk[]> = {}

export function getRecorder() { return Recorder8 }

const incrementRecordingCount = () => (dispatch) => {
  dispatch({type: 'RECORDING/INCREMENT_COUNT'})
}

const incrementRecordingFail = () => (dispatch) => {
  dispatch({type: 'RECORDING/INCREMENT_FAIL'})
}

const incrementRecordingQueue = () => (dispatch) => {
  dispatch({type: 'RECORDING/INCREMENT_QUEUE'})
}

// Set up a new recording on our server. Reset the worker to be ready to send data to the server.
const newRecording = (deviceSuffix: string) => dispatch => (
  dispatch(fetchJson(`/record/${deviceSuffix}`, {method: 'POST'})).then(({id}) => {
    workerReport.success = () => dispatch(incrementRecordingCount())
    workerReport.error = () => dispatch(incrementRecordingFail())
    worker.postMessage({action: 'reset'})
    dispatch({type: 'RECORDING/NEW', currentId: id})
  })
)

// Chrome desktop supports video/webm
// iOS Safari supports video/mp4
// TODO(dat): Choose based on deviceInfo?
// const VIDEO_CONTAINER = 'video/webm'
// const VIDEO_MIMETYPE = `${VIDEO_CONTAINER}; codecs=vp8`

const VIDEO_CONTAINER = 'video/mp4'
const VIDEO_MIMETYPE = `${VIDEO_CONTAINER}`
const newRecorder = (stream: MediaStream) => () => {
  // Reset our media recorder
  // These settings are similar to what we have in MediaRecorderFactory
  // (see direct-recorder and native-recorder)
  mediaRecorder_ = new MediaRecorder(stream, {
    mimeType: VIDEO_MIMETYPE,
    // 10mbps video, 128kbps audio
    videoBitsPerSecond: 10 * 1000 * 1000,
    audioBitsPerSecond: 128 * 1000,
  })
  dataChunks_ = []
  mediaRecorder_.ondataavailable = (e) => {
    // TODO(dat): Add data to device storage (e.g. indexeddb)
    if (e.data && e.data.size > 0) {
      dataChunks_.push(e.data)
    }
  }
}

const appendRecording = (
  id: string, data: ArrayBuffer | ArrayBufferView
) => () => {
  // NOTE(dat): do NOT pack the message as that slow down the recording by half the fps
  const message = new capnp.Message(data, false)

  // This allocates a new ArrayBuffer which allows us to transfer its ownership to the worker
  // Testing shows that generating an ArrayBuffer specifically for transfer here is much faster
  // . than passing `data` directly which requires an implicit copy to the worker
  const messageArrayBuf = message.toArrayBuffer()
  if (capnpChunksById_[id] === undefined) {
    capnpChunksById_[id] = []
  }
  capnpChunksById_[id].push({message: messageArrayBuf})
}

const streamRecordingToServer = (
  id: string, deviceSuffix: string, isMp4: boolean
) => async (dispatch) => {
  const allCapnpChunks = capnpChunksById_[id]

  if (!isMp4) {
    // We need to stream each chunk separately
    for (let i = 0; i < allCapnpChunks.length; i++) {
      const dataChunk = allCapnpChunks[i]
      const workerData = {
        id,
        deviceSuffix,
        action: 'append',
        frameNum: i + 1,
        message: dataChunk.message,
      }
      worker.postMessage(workerData, [workerData.message])
      dispatch(incrementRecordingQueue())
    }
    delete capnpChunksById_[id]
    return
  }

  // We are recording in an mp4. The data chunk is tiny in comparison.
  await dispatch(fetchJson(`/record/${deviceSuffix}/${id}/upload/log`, {
    method: 'POST',
    body: new Blob(allCapnpChunks.map(c => c.message)),
  }))

  await dispatch(fetchJson(`/record/${deviceSuffix}/${id}/upload/video/mp4`, {
    method: 'POST',
    body: mp4ById_[id],
  }))
  delete capnpChunksById_[id]
  delete mp4ById_[id]
}

const streamRecordingsToServer = (deviceSuffix: string, isMp4: boolean) => async (dispatch) => {
  const allRecordingIds = Object.keys(mp4ById_)
  for (let i = 0; i < allRecordingIds.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await dispatch(streamRecordingToServer(allRecordingIds[i], deviceSuffix, isMp4))
  }
}

const stopRecording = (id: string) => (dispatch) => {
  mediaRecorder_?.addEventListener('stop', () => {
    mp4ById_[id] = new Blob(dataChunks_, {type: VIDEO_CONTAINER})
  }, {once: true})
  mediaRecorder_?.stop()
  return dispatch({type: 'RECORDING/SET_STATUS', status: 'STOPPED'})
}

const startRecording = () => (dispatch) => {
  mediaRecorder_?.start(1000)
  return dispatch({type: 'RECORDING/SET_STATUS', status: 'RUNNING'})
}

const initializeIfNeeded = () => async (dispatch) => {
  await loadRecorder8()
  dispatch({type: 'RECORDING/SET_READY'})
}

const rawActions = {
  appendRecording,
  initializeIfNeeded,
  newRecording,
  newRecorder,
  startRecording,
  stopRecording,
  streamRecordingsToServer,
}

export type RecordingActions = DispatchifiedActions<typeof rawActions>

export default dispatchify(rawActions)
