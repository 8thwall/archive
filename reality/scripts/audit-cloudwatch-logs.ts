// @rule(js_cli)

// This script gets the total size of stored logs, and checks the retention policies set.

// Usage:
//   bazel run //reality/scripts:audit-cloudwatch-logs

import {executeAwsCommand, REGIONS} from './lib/aws-cli'

const run = async () => {
  let totalBytes = 0
  const retentionCounts = {}
  const regionBytes = {}

  for (let i = 0; i < REGIONS.length; i++) {
    const region = REGIONS[i]

    // eslint-disable-next-line no-await-in-loop
    const {logGroups} = await executeAwsCommand({
      service: 'logs',
      command: 'describe-log-groups',
      region,
    })

    let currentBytes = 0
    logGroups.forEach((group) => {
      currentBytes += group.storedBytes

      const retention = group.retentionInDays || '[unspecified]'
      if (retentionCounts[retention] === undefined) {
        retentionCounts[retention] = 0
      }
      retentionCounts[retention] += 1
    })

    totalBytes += currentBytes
    regionBytes[region] = currentBytes
  }

  const regionByteStrings = Object.entries(regionBytes).reduce((acc, [region, bytes]) => {
    acc[region] = bytes.toLocaleString()
    return acc
  }, {} as Record<string, string>)

  // eslint-disable-next-line no-console
  console.log({
    totalBytes: totalBytes.toLocaleString(),
    retentionCounts,
    regionBytes: regionByteStrings,
  })
}

run()
