// @rule(js_cli)

// This script ensures any log groups without a retention policy set gets limited to 90 days.

// Usage:
//   bazel run //reality/scripts:fix-cloudwatch-retention

import {executeAwsCommand, Region, REGIONS} from './lib/aws-cli'

const run = async () => {
  const missingRetentionGroups = [] as {region: Region, name: string}[]

  for (let i = 0; i < REGIONS.length; i++) {
    const region = REGIONS[i]

    // eslint-disable-next-line no-console
    console.warn('Looking at', region)

    // eslint-disable-next-line no-await-in-loop
    const {logGroups} = await executeAwsCommand({
      service: 'logs',
      command: 'describe-log-groups',
      region,
    })

    logGroups.forEach((group) => {
      if (!group.retentionInDays) {
        missingRetentionGroups.push({region, name: group.logGroupName})
      }
    })
  }

  for (let i = 0; i < missingRetentionGroups.length; i++) {
    const group = missingRetentionGroups[i]

    // eslint-disable-next-line no-console
    console.warn(Object.values(group).join(', '))

    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => setTimeout(resolve, 1000))

    // eslint-disable-next-line no-await-in-loop
    await executeAwsCommand({
      service: 'logs',
      command: 'put-retention-policy',
      region: group.region,
      parameters: {
        'log-group-name': group.name,
        'retention-in-days': '180',
      },
      noParse: true,
    })
  }
}

run()
