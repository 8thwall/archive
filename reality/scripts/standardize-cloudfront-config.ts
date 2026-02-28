#!/usr/bin/env npx ts-node

// Usage:
//   > ./scripts/standardize-cloudfront-config.ts path/to/file.json
//   > aws cloudfront get-distribution-config --id xxx | ./scripts/standardize-cloudfront-config.ts

import fs from 'fs'

import {standardizeConfig} from '../reality/cloud/aws/cloudfront/config/standardize'

const STDIN = 0  // Fallback file descriptor for receiving pipes from standard input

const run = (inputFile?: string) => {
  const data = fs.readFileSync(inputFile || STDIN, 'utf8')
  let config = JSON.parse(data)
  if (config.DistributionConfig) {
    config = config.DistributionConfig
  }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(standardizeConfig(config), null, 2))
}

run(process.argv[2])
