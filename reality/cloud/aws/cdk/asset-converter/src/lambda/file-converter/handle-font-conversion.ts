import * as fs from 'fs'
import * as path from 'path'
import {generateMtsdf} from '@nia/third_party/msdfgen-bmfont/src/generate-mtsdf'

import type {ConversionRequest} from '../../shared/types'
import {S3} from '../../shared/integrations/s3'
import {makeCodedError} from '../../shared/error'
import {createZipStream} from '../../shared/zipfile'

const INPUT_DIR = '/tmp/input'
const OUTPUT_DIR = '/tmp/output'
const BIN_PATH = 'LD_LIBRARY_PATH=/opt/msdfgen/lib /opt/msdfgen/msdfgen.linux'

const handleFontConversion = async (key: string, request: ConversionRequest) => {
  const {downloadFileKey} = request

  const {Body} = await S3.use().getObject({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  })

  if (!Body) {
    throw makeCodedError('Invalid content', 400)
  }

  // clean up tmp directories if they exist
  if (fs.existsSync(INPUT_DIR)) {
    fs.rmSync(INPUT_DIR, {recursive: true, force: true})
  }
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, {recursive: true, force: true})
  }

  // create input and output directories for FBX2glTF
  fs.mkdirSync(INPUT_DIR, {recursive: true})
  fs.mkdirSync(OUTPUT_DIR, {recursive: true})

  const inputFilePath = path.join(INPUT_DIR, path.parse(key).base)

  if (!Body) {
    throw makeCodedError('Invalid content', 400)
  }
  const buffer = await Body.transformToByteArray()
  fs.writeFileSync(inputFilePath, buffer)

  let conversionError = false
  const res = {} as {stdout?: string; stderr?: string}

  try {
    const {textures, font} = await generateMtsdf(BIN_PATH, inputFilePath, OUTPUT_DIR)
    textures.forEach((texture) => {
      fs.writeFileSync(`${texture.filename}.png`, texture.texture)
    })
    fs.writeFileSync(font.filename, font.data)
  } catch (err: any) {
    conversionError = true
    res.stderr = err.stderr
    console.error('error executing TTF2MTSDF: ', err)
  }

  const resJson = JSON.stringify(res, null, 2)
  const resJsonPath = path.join(OUTPUT_DIR, 'res.json')
  fs.writeFileSync(resJsonPath, resJson)

  const filesToZip: [Buffer, {name: string}][] = [
    [fs.readFileSync(resJsonPath), {name: 'res.json'}],
  ]

  if (!conversionError) {
    const files = fs.readdirSync(OUTPUT_DIR)
    files.forEach((file) => {
      const filePath = path.join(OUTPUT_DIR, file)
      const fileContent = fs.readFileSync(filePath)
      filesToZip.push([fileContent, {name: file}])
    })
  }
  const zipStream = createZipStream(filesToZip)

  const upload = S3.use().upload({
    Bucket: process.env.BUCKET_NAME,
    Key: downloadFileKey,
    ContentType: 'application/zip',
    Body: zipStream,
  })
  upload.on('httpUploadProgress', progress => console.log(progress))
  await upload.done()

  fs.rmSync(INPUT_DIR, {recursive: true})
  fs.rmSync(OUTPUT_DIR, {recursive: true})
}

export {handleFontConversion}
