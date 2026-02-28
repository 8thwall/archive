import type {SFNClient} from '@aws-sdk/client-sfn'

import {entry} from '../../registry'

const SFN = entry<SFNClient>('sfn')

export {SFN}
