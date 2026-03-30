import {execSync} from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

import {S3} from '../../shared/integrations/s3'
import type {ConversionRequest} from '../../shared/types'
import {makeCodedError} from '../../shared/error'
import {createZipStream} from '../../shared/zipfile'

const INPUT_DIR = '/tmp/input'
const OUTPUT_DIR = '/tmp/output'

const handleGlbConversion = async (key: string, request: ConversionRequest) => {
  const {downloadFileKey} = request

  // get object from S3
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

  const inputFilePath = path.join(INPUT_DIR, 'model.fbx')
  const outputFilePath = path.join(OUTPUT_DIR, 'model.glb')
  const buffer = await Body.transformToByteArray()
  fs.writeFileSync(inputFilePath, buffer)

  // run FBX2glTF command with draco compression
  let conversionError = false
  const res = {} as {stdout?: string; stderr?: string}
  try {
    const stdout = execSync(
      // eslint-disable-next-line max-len
      `/opt/FBX2glTF-linux-x86_64 --input ${inputFilePath} --output ${outputFilePath} --binary --draco`,
      {encoding: 'utf-8'}
    )
    res.stdout = stdout
    console.log('stdout:', stdout)
  } catch (err: any) {
    conversionError = true
    res.stderr = err.stderr
    console.error('error executing FBX2glTF: ', err)
  }

  // write conversion result to res.json
  const resJson = JSON.stringify(res, null, 2)
  const resJsonPath = path.join(OUTPUT_DIR, 'res.json')
  fs.writeFileSync(resJsonPath, resJson)

  // create a zip with converted glb and res.json
  const filesToZip: [Buffer, {name: string}][] = [
    [fs.readFileSync(resJsonPath), {name: 'res.json'}],
  ]
  if (!conversionError) {
    const {name} = path.parse(key)
    const glb = fs.readFileSync(outputFilePath)
    filesToZip.push([glb, {name: `${name}.glb`}])
  }
  const zipStream = createZipStream(filesToZip)

  // upload zip to S3
  const upload = S3.use().upload({
    Bucket: process.env.BUCKET_NAME,
    Key: downloadFileKey,
    ContentType: 'application/zip',
    Body: zipStream,
  })
  upload.on('httpUploadProgress', p => console.log(p))
  await upload.done()

  // clean up tmp directories
  fs.rmSync(INPUT_DIR, {recursive: true})
  fs.rmSync(OUTPUT_DIR, {recursive: true})
}

export {handleGlbConversion}
