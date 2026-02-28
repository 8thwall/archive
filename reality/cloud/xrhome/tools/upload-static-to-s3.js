#!/usr/bin/env node

// Usage: ./tools/upload-static-to-s3.js folder-name bucket-name
// It will upload files that don't yet exist, and throw an error if the file on s3 differs from
// the local

/* eslint-disable no-console */
const fs = require('fs')
const {exec} = require('child_process')
const AWS = require('aws-sdk')
const mime = require('mime')

// Jenkins credentials
const credentials = require('../src/server/scripts/aws-config')

AWS.config.update({...credentials})

const s3 = new AWS.S3()

function uploadFileToS3(filePath, bucket, key) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, fileBuffer) => {
      if (err) {
        reject(err)
        return
      }

      s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        CacheControl: 'public,max-age=31536000',
        ContentType: mime.getType(filePath),
      }).promise().then(resolve).catch(reject)
    })
  })
}

function getFileMetadata(filePath) {
  return new Promise((resolve, reject) => {
    fs.lstat(filePath, (err, fileMetadata) => {
      if (err) {
        reject(err)
        return
      }
      resolve(fileMetadata)
    })
  })
}

async function syncFileToS3(filePath, bucket, key) {
  let s3Metadata
  try {
    s3Metadata = await s3.headObject({Bucket: bucket, Key: key}).promise()
  } catch (ignored) {
    // File doesn't exist on s3, upload it
    await uploadFileToS3(filePath, bucket, key)
    console.log(`Uploaded ${key}`)
    return
  }

  const fileMetadata = await getFileMetadata(filePath)

  if (s3Metadata.ContentLength !== fileMetadata.size) {
    throw new Error(`Local file ${filePath} differs in size from s3 file: ${key}`)
  }
}

function listFiles(directoryPath) {
  return new Promise((resolve, reject) => {
    exec(`find ${directoryPath} -type f`, (err, stdout) => {
      if (err) {
        reject(err)
        return
      }
      resolve(stdout.trim().split('\n'))
    })
  })
}

async function syncFolderToS3(directoryPath, bucket) {
  console.log('Uploading static files')
  const filePaths = await listFiles(directoryPath)

  await Promise.all(filePaths.map((path) => {
    const key = path.substring((`${directoryPath}/`).length)
    return syncFileToS3(path, bucket, key)
  })).then(() => {
    console.log('Static upload complete')
  }).catch((err) => {
    console.log(`Error while uploading static files: ${err}`)
    process.exit(1)
  })
}

const [, , directoryPath, bucket] = process.argv

syncFolderToS3(directoryPath, bucket)
