import type {ModuleChannelData} from '../../shared/module/module-build-data'

type ModuleChannelState = (ModuleChannelData & {none?: never}) | {none: true, commitId?: never}

export type {
  ModuleChannelState,
}
