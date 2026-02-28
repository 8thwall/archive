import {entry} from '../../registry'

import type {createCodeCommitProxy} from './codecommit-proxy-impl'

const CodeCommitProxy = entry<ReturnType<typeof createCodeCommitProxy>>('codecommit-proxy')

export {CodeCommitProxy}
