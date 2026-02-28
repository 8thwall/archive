#!/usr/bin/env node

// This script collects buildInfo emitted by the build process and submits it to s3
// Original Author: pawel
/* eslint-disable no-console */

const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')

const s3 = new aws.S3()

const delayMs = ms => new Promise(resolve => setTimeout(resolve, ms))

// NOTE(pawel) As of August 2020, we are using the same build artifact for console, apps-client
// apps and console-client. Instead of creating a cross-product number of keys of redundant
// information, we'll use 'xrhome' as a logical grouping. When we do split the build processes
// for individual executable artifacts then we'll want to update this
// Relevant doc: Standard Application Environments
// https://docs.google.com/document/d/1dT_YaL0YyLNuHBRyYmoosXDwcCErDvOTumNME5bdMcM

const S3_PREFIX = 'build-info/xrhome'
const SUBMISSION_BUCKET = '8w-internal-90d-ttl'
const BUILD_INFO_DIR = 'deployment/build-info'

const packageBuildInfo = () => {
  const buildInfo = {}
  const directoryContents = fs.readdirSync(BUILD_INFO_DIR)
  directoryContents.forEach((fileName) => {
    const filePath = path.join(BUILD_INFO_DIR, fileName)
    const fileStat = fs.statSync(filePath)
    if (fileStat.isFile() && fileName !== '.empty') {
      const fileContents = fs.readFileSync(filePath, {
        encoding: 'utf-8',
      })
      buildInfo[fileName] = fileContents.trim()
    }
  })
  return buildInfo
}

// Automatically write multiple objects based on each lookup
const submitBuildInfoToS3 = (buildInfo) => {
  const Bucket = SUBMISSION_BUCKET
  const Body = JSON.stringify(buildInfo, null, 2)
  let putObjectsPromise = Promise.resolve()

  Object.keys(buildInfo).forEach((keyName) => {
    const Key = `${S3_PREFIX}/${keyName}/${buildInfo[keyName]}`

    putObjectsPromise = putObjectsPromise.then(() => (
      s3.putObject({Bucket, Key, Body}).promise()
    )).then(() => {
      console.log(`Wrote Build Info to: ${Key}`)
      return delayMs(100)
    })
  })

  return putObjectsPromise
}

const packageAndSubmitBuildInfo = () => {
  const buildInfo = packageBuildInfo()
  console.log('Gathered Build Info', JSON.stringify(buildInfo, null, 2))
  return submitBuildInfoToS3(buildInfo)
}

packageAndSubmitBuildInfo().then(() => {
  console.log('Build Info submitted')
  process.exit(0)
}).catch((err) => {
  console.error(err)
  process.exit(1)
})
