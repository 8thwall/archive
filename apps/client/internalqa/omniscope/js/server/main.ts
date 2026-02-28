/* eslint-disable no-console */

import express from 'express'
import compression from 'compression'
import getRawBody from 'raw-body'
import https from 'https'
import fs from 'fs'
import path from 'path'
import process from 'process'
import qrcode from 'qrcode-terminal'

import {getCert} from 'c8/cli/cert'
import {guessIp} from 'c8/cli/ip'

const PORT_NUMBER = 3005
const DATA_RECORDER_LOG_DIR = path.join(process.env.HOME, 'datarecorder', 'remote')
if (!fs.existsSync(DATA_RECORDER_LOG_DIR)) {
  fs.mkdirSync(DATA_RECORDER_LOG_DIR, {recursive: true})
}
const FRAME_NUM_STRICT = true

const app = express()
app.use(compression())

function getFilePath(id: string, suffixClean: string, prefix = 'log'): string {
  return path.join(DATA_RECORDER_LOG_DIR, `${prefix}.${id}-${suffixClean}`)
}

function createNewRecord(req, res) {
  const newId = new Date().valueOf().toString()
  const suffixClean = req.params.deviceSuffix || ''
  // Create an empty file
  const fileName = getFilePath(newId, suffixClean)
  fs.closeSync(fs.openSync(fileName, 'w'))
  res.send({id: newId})
}

const recordIdToLastFrameNum = {}
function addRecord(req, res) {
  const {recordId, deviceSuffix, frameNum: frameNumStr} = req.params
  const frameNum = parseInt(frameNumStr, 10)
  const data = req.rawBody

  const thisRecordLastFrameNum = recordIdToLastFrameNum[recordId] || 0
  if (FRAME_NUM_STRICT && frameNum !== (thisRecordLastFrameNum + 1)) {
    res.status(400).json({msg: `Expecting frame ${thisRecordLastFrameNum + 1}. Getting frame ${frameNum}`})
    return
  }

  const suffixClean = req.params.deviceSuffix || ''
  fs.appendFileSync(getFilePath(recordId, suffixClean), data)
  recordIdToLastFrameNum[recordId] = frameNum
  res.status(200).json({length: data.byteLength})
}

const uploadFile = (req, res) => {
  const {recordId, deviceSuffix, fileExtension, prefix} = req.params
  const suffixClean = deviceSuffix || ''
  const fileName = fileExtension ? `${suffixClean}.${fileExtension}` : suffixClean
  const filePath = getFilePath(recordId, fileName, prefix)
  const data = req.rawBody
  fs.writeFileSync(filePath, data)
  res.status(200).json({length: data.byteLength})
}
/// //////////////////////////////////////////////////////////

function rawBody(req, res, next) {
  getRawBody(req, {
    length: req.headers['content-length'],
  }, (err, string) => {
    if (err) {
      next(err)
      return
    }
    req.rawBody = string
    next()
  })
}

app.post('/record/:deviceSuffix', createNewRecord)
app.patch('/record/:deviceSuffix/:recordId/:frameNum', rawBody, addRecord)
app.post('/record/:deviceSuffix/:recordId/upload/:prefix/:fileExtension?', rawBody, uploadFile)

const dir = './apps/client/internalqa/omniscope/js'
app.use(express.static(dir))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(`${dir}/server/index.html`))
})

const root = `https://${guessIp()}:${PORT_NUMBER}`
console.log(`Listening on ${root}. Data will be written to ${DATA_RECORDER_LOG_DIR}`)
qrcode.generate(root, {small: true}, code => console.log(`\n${code}\n`))
const server = https.createServer(getCert({info: console.log}), app)
server.listen(PORT_NUMBER)
