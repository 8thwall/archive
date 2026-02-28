/* eslint-disable no-console */
// Usage: npx ts-node ./upload-monaco-editor-to-s3.ts
// NOTE(johnny): This script will upload the minified monaco-editor files to S3.
// To use, update the path in `xrhome/src/third_party/react-monaco/src/hooks/useMonaco`

import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import {promisify} from 'util'
import AWS from 'aws-sdk'
import mime from 'mime'
import childProcess from 'child_process'

const MONACO_VERSION = '0.33.0'
const S3_BUCKET = '8w-us-west-2-web'

const exec = promisify(childProcess.exec)

const s3 = new AWS.S3()

const uploadFileToS3 = (filePath: string, key: string, contentEncoding?: string) => new Promise(
  (resolve, reject) => {
    fs.readFile(filePath, (err, fileBuffer) => {
      if (err) {
        reject(err)
        return
      }

      s3.putObject({
        Bucket: S3_BUCKET,
        Key: key,
        Body: fileBuffer,
        CacheControl: 'public,max-age=31536000',
        ContentEncoding: contentEncoding,
        ContentType: mime.getType(filePath),
      }).promise().then(resolve).catch(reject)
    })
  }
)

const uploadMonacoEditorToS3 = async () => {
  // Define the local temp folder path
  const tempFolderPath = path.join(__dirname, 'tmp')

  if (!fs.existsSync(tempFolderPath)) {
    fs.mkdirSync(tempFolderPath)
  }

  // Install Monaco Editor using npm or your preferred package manager
  // Replace 'npm' with your package manager command if different
  await exec(`npm install monaco-editor@${MONACO_VERSION} --prefix ${tempFolderPath}`)

  console.log(`Monaco Editor installed successfully in ${tempFolderPath}`)

  const monacoEditorFolderPath = path.join(tempFolderPath, 'node_modules/monaco-editor')
  const minFolderPath = path.join(monacoEditorFolderPath, 'min')
  const minMapsFolderPath = path.join(monacoEditorFolderPath, 'min-maps')
  const timestamp = Date.now().toString(36)

  const fileList: string[] = []
  const walkSync = (dir: string) => {
    fs.readdirSync(dir).forEach((file: string) => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        walkSync(filePath)
      } else {
        fileList.push(filePath)
      }
    })
  }

  walkSync(minFolderPath)
  walkSync(minMapsFolderPath)

  console.log('Uploading files to S3')
  await Promise.all(
    fileList.map(async (filePath: string) => {
      let contentEncoding: string

      // Pre-zip the JavaScript files and set Content-Encoding to gzip
      if (filePath.endsWith('.js') || filePath.endsWith('.js.map')) {
        const gzipFilePath = `${filePath}.gz`
        contentEncoding = 'gzip'

        const input = fs.createReadStream(filePath)
        const output = fs.createWriteStream(gzipFilePath)

        await new Promise((resolve, reject) => {
          input.pipe(zlib.createGzip()).pipe(output).on('finish', resolve).on('error', reject)
        })

        fs.unlinkSync(filePath)  // Delete the original JavaScript file
        fs.renameSync(gzipFilePath, filePath)  // Rename the gzipped file to the original file name
      }
      const relative = path.relative(monacoEditorFolderPath, filePath)

      await uploadFileToS3(
        filePath,
        `web/monaco/${MONACO_VERSION}-${timestamp}/${relative}`,
        contentEncoding
      )
    })
  )

  console.log('Deleting temp folder')
  // Delete temp folder
  await exec(`rm -rf ${tempFolderPath}`)

  console.log('Done. To access, use: ')
  console.log(`https://cdn.8thwall.com/web/monaco/${MONACO_VERSION}-${timestamp}/min/vs`)
}

uploadMonacoEditorToS3().catch((err) => {
  console.log('An error occurred:', err)
})
