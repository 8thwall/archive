// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Rishi Parikh (rishi@8thwall.com)
//
// Calculates image target scores.

import {promisify} from 'util'
import {exec} from 'child_process'
import aws from 'aws-sdk'
import * as fs from 'fs'

// When running locally you will need to authenticate using aws cli.
// TODO: On ECS we need to create a rule to authenticate.

aws.config.apiVersions = {
  s3: '2006-03-01',
}
const S3 = new aws.S3()

const execPromise = promisify(exec)

const runJob = async (reqJson) => {
  S3.getObject(
    {
      Bucket: '8w-datasets',
      Key: reqJson.filename,
    },
    (err, data: any) => {
      if (err != null) {
        // eslint-disable-next-line no-console
        console.log('error fetching file from s3')
        return err
      } else {
        reqJson.filename = reqJson.filename.split('/').pop()
        fs.writeFileSync(reqJson.filename, data.Body)
        return null
      }
    }
  )
  reqJson.filename = reqJson.filename.split('/').pop()
  const params = `-j ${JSON.stringify(reqJson)}`
  const calcLocation = './reality/cloud/imageprocessor/calc-score'
  const command = `xvfb-run -a --server-args='-screen 0 640x480x24' ${calcLocation} '${params}'`
  const {stdout} = (await execPromise(command))
  return JSON.parse(`${stdout.split('\n').slice(-2).join().slice(0, -1)}`)
}

// Sample JSON input and curl command
// selfies/1.jpg is a bin in 8thwall s3
// `curl -d '{"filename": "selfies/1.jpg", "render": "true"}'
//    -H 'Content-Type: application/json' :80/compute`
// {"filename": "path/to/file.jpg", "render": "true", any other key-value pairs also here"}
const handleComputeRequest = async (req, res) => {
  try {
    const computeResult = await runJob(req.body)
    res.json(computeResult)
  } catch (err) {
    res.status(500).json({message: 'Unable to retrieve image target score', error: err})
  }
  const filesToRem = [req.body.filename]
  filesToRem.forEach((file) => {
    fs.unlink(file, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(`error deleting the file ${file}`)
      }
    })
  })
}

export {
  handleComputeRequest,
}
