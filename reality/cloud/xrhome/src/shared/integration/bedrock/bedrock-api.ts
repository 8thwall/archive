import type {BedrockRuntimeClient} from '@aws-sdk/client-bedrock-runtime'

import {entry} from '../../registry'

const Bedrock = entry<BedrockRuntimeClient>('bedrock')

export {Bedrock}
