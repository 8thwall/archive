import type {DeepReadonly as RO} from 'ts-essentials'
import {GetParameterCommand, SSMClient} from '@aws-sdk/client-ssm'

interface CodeCommitPartitionConfig {
  region: string
  accessKeyId: string
  secretAccessKey: string
  httpUser: string
  httpPassword: string
}

type PartitionInfo = RO<Record<string, CodeCommitPartitionConfig>>

const _getPartitionInfo = async (): Promise<PartitionInfo> => {
  const ssm = new SSMClient({region: 'us-west-2'})

  const keys = [
    '/Prod/secrets/cc-partition-info-2025-07-21-part1',
    '/Prod/secrets/cc-partition-info-2025-07-21-part2',
  ]

  const partitions: Record<string, CodeCommitPartitionConfig> = {}

  await Promise.all(keys.map(async (key) => {
    const res = await ssm.send(new GetParameterCommand({
      Name: key,
      WithDecryption: true,
    }))

    if (!res.Parameter || !res.Parameter.Value) {
      throw new Error('Could not load partition info.')
    }

    Object.assign(partitions, JSON.parse(res.Parameter.Value))
  }))

  return partitions
}

let partitionInfo: Promise<PartitionInfo> | null = null

const getPartitionInfo = (): Promise<PartitionInfo> => {
  if (!partitionInfo) {
    partitionInfo = _getPartitionInfo()
  }
  return partitionInfo
}

const getAvailablePartitions = async (): Promise<string[]> => (
  Object.keys(await getPartitionInfo()).map(k => `cc.${k}`)
)

export {
  getPartitionInfo,
  getAvailablePartitions,
}
