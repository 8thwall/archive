/* eslint-disable no-await-in-loop */
import {exec as execNode} from 'child_process'

const REGIONS = [
  'eu-north-1',
  'ap-south-1',
  'eu-west-3',
  'eu-west-2',
  'eu-west-1',
  'ap-northeast-3',
  'ap-northeast-2',
  'ap-northeast-1',
  'sa-east-1',
  'ca-central-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'eu-central-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
] as const

type Region = typeof REGIONS[number]

type AwsCommandOptions = {
  service: string
  command: string
  region: Region
  parameters?: Record<string, string>
  noParse?: boolean
}

const getCommandOutput = (command: string) => new Promise<string>((resolve, reject) => {
  execNode(command, (err, stdout) => {
    if (err) {
      reject(err)
      return
    }
    resolve(stdout.toString())
  })
})

const makeAwsCommand = (options: AwsCommandOptions) => {
  const parts: string[] = ['aws', options.service, options.command, '--region', options.region]

  if (options.parameters) {
    Object.entries(options.parameters).forEach(([key, value]) => {
      parts.push(`--${key}`, `'${value}'`)
    })
  }

  return parts.join(' ')
}

const executeAwsCommand = async (options: AwsCommandOptions) => {
  const command = makeAwsCommand(options)

  const output = await getCommandOutput(command)
  if (options.noParse) {
    return output
  }
  return JSON.parse(output) as any
}

export {
  Region,
  REGIONS,
  executeAwsCommand,
}
