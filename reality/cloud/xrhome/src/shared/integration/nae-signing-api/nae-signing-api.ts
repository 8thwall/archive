import {entry} from '../../registry'

import type {createNaeSigningApi} from './nae-signing-api-impl'

const NaeSigningApi = entry<ReturnType<typeof createNaeSigningApi>>('nae-signing-api')

export {NaeSigningApi}
