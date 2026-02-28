import {entry} from '../../registry'

import type {createStudioApi} from './studio-api-impl'

const StudioApi = entry<ReturnType<typeof createStudioApi>>('studio-api')

export {StudioApi}
