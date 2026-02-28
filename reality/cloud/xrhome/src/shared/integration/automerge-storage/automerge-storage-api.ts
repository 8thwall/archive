import {entry} from '../../registry'

import type {createAutomergeStorage} from './automerge-storage-impl'

const AutomergeStorage = entry < ReturnType<typeof createAutomergeStorage>>('automerge-storage')

export {AutomergeStorage}
