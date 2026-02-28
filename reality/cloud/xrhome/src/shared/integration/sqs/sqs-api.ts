import type {SQSClient} from '@aws-sdk/client-sqs'

import {entry} from '../../registry'

const SQS = entry<SQSClient>('sqs')

export {SQS}
