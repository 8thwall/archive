import type {
  BuildInfo, DependencyTargetsResponse, VersionInfo,
} from '../../shared/module/module-target-api'
import type {IModule, IModuleUser, IPublicModule} from '../common/types/models'
import type {ModuleChannelState} from './redux-types'

const LIST_MODULES_ACTION_TYPE = 'MODULES/LIST'
const LIST_PUBLIC_MODULES_ACTION_TYPE = 'PUBLIC_MODULES/LIST'
const LIST_PUBLIC_ACCOUNT_MODULES_ACTION_TYPE = 'PUBLIC_MODULES/LIST_FOR_ACCOUNT'
const PATCH_MODULES_ACTION_TYPE = 'MODULES/PATCH'
const CREATE_MODULES_ACTION_TYPE = 'MODULES/CREATE'
const CHANNEL_UPDATE_ACTION_TYPE = 'MODULES/CHANNEL/UPDATE'
const HISTORY_UPDATE_ACTION_TYPE = 'MODULES/HISTORY/UPDATE'
const TARGETS_UPDATE_ACTION_TYPE = 'MODULES/TARGETS/UPDATE'
const VERSION_UPDATE_ACTION_TYPE = 'MODULES/VERSION/UPDATE'
const VERSION_NEW_ACTION_TYPE = 'MODULES/VERSION/NEW'
const VERSION_PATCH_ACTION_TYPE = 'MODULES/VERSION/PATCH'
const UPDATE_MODULE_USER_ACTION_TYPE = 'MODULE_USER/UPDATE'
const FETCH_PUBLIC_MODULE_ACTION_TYPE = 'PUBLIC_MODULES/DETAIL/FETCH'

type MODULE_ACTION_TYPE = typeof LIST_MODULES_ACTION_TYPE |
    typeof LIST_PUBLIC_MODULES_ACTION_TYPE |
    typeof LIST_PUBLIC_ACCOUNT_MODULES_ACTION_TYPE |
    typeof PATCH_MODULES_ACTION_TYPE |
    typeof CREATE_MODULES_ACTION_TYPE |
    typeof CHANNEL_UPDATE_ACTION_TYPE |
    typeof HISTORY_UPDATE_ACTION_TYPE |
    typeof TARGETS_UPDATE_ACTION_TYPE |
    typeof VERSION_UPDATE_ACTION_TYPE |
    typeof VERSION_PATCH_ACTION_TYPE |
    typeof UPDATE_MODULE_USER_ACTION_TYPE |
    typeof FETCH_PUBLIC_MODULE_ACTION_TYPE

interface ListModulesAction {
  type: typeof LIST_MODULES_ACTION_TYPE
  modules: IModule[]
  accountUuid: string
}

interface ListPublicModulesAction {
  type: typeof LIST_PUBLIC_MODULES_ACTION_TYPE
  modules: IPublicModule[]
}

interface ListPublicAccountModulesAction {
  type: typeof LIST_PUBLIC_ACCOUNT_MODULES_ACTION_TYPE
  modules: IPublicModule[]
  accountUuid?: string
}

interface PatchModuleAction {
  type: typeof PATCH_MODULES_ACTION_TYPE
  module: IModule
}

interface CreateModuleAction {
  type: typeof CREATE_MODULES_ACTION_TYPE
  module: IModule
  accountUuid: string
}

interface ChannelUpdateModuleAction {
  type: typeof CHANNEL_UPDATE_ACTION_TYPE
  moduleUuid: string
  channelName: string
  channelState: ModuleChannelState
}

interface HistoryUpdateModuleAction {
  type: typeof HISTORY_UPDATE_ACTION_TYPE
  moduleUuid: string
  history: BuildInfo[]
}

interface TargetsUpdateModuleAction {
  type: typeof TARGETS_UPDATE_ACTION_TYPE
  moduleUuid: string
  targets: DependencyTargetsResponse
}

interface VersionUpdateModuleAction {
  type: typeof VERSION_UPDATE_ACTION_TYPE
  moduleUuid: string
  patches: VersionInfo[]
  prePatches?: VersionInfo[]
}

interface VersionPatchModuleAction {
  type: typeof VERSION_PATCH_ACTION_TYPE
  moduleUuid: string
  version: VersionInfo
}

interface VersionNewModuleAction {
  type: typeof VERSION_NEW_ACTION_TYPE
  moduleUuid: string
  patch: VersionInfo
}

interface UpdateModuleUserAction {
  type: typeof UPDATE_MODULE_USER_ACTION_TYPE
  moduleUuid: string
  moduleUser: Partial<IModuleUser>
}

interface FetchPublicModuleAction {
  type: typeof FETCH_PUBLIC_MODULE_ACTION_TYPE
  module: IPublicModule
}

type ModuleActions = ListModulesAction | ListPublicModulesAction | PatchModuleAction |
                     CreateModuleAction | ChannelUpdateModuleAction | TargetsUpdateModuleAction |
                     VersionUpdateModuleAction | VersionNewModuleAction | VersionPatchModuleAction |
                     UpdateModuleUserAction | FetchPublicModuleAction | HistoryUpdateModuleAction |
                     ListPublicAccountModulesAction

const listModulesAction = (accountUuid: string, modules: IModule[]): ListModulesAction => ({
  type: LIST_MODULES_ACTION_TYPE,
  modules,
  accountUuid,
})

const listPublicModulesAction = (modules: IPublicModule[]): ListPublicModulesAction => ({
  type: LIST_PUBLIC_MODULES_ACTION_TYPE,
  modules,
})

const listPublicBrowseModulesAction = (
  modules: IPublicModule[], accountUuid: string
): ListPublicAccountModulesAction => ({
  type: LIST_PUBLIC_ACCOUNT_MODULES_ACTION_TYPE,
  modules,
  accountUuid,
})

const fetchPublicModuleAction = (module: IPublicModule): FetchPublicModuleAction => ({
  type: FETCH_PUBLIC_MODULE_ACTION_TYPE,
  module,
})

const patchModuleAction = (moduleUuid: string, module: IModule): PatchModuleAction => ({
  type: PATCH_MODULES_ACTION_TYPE,
  module,
})

const createModuleAction = (accountUuid: string, module: IModule): CreateModuleAction => ({
  type: CREATE_MODULES_ACTION_TYPE,
  accountUuid,
  module,
})

const updateChannelModuleAction = (
  moduleUuid: string, channelName: string, channelState: ModuleChannelState
): ChannelUpdateModuleAction => ({
  type: CHANNEL_UPDATE_ACTION_TYPE,
  moduleUuid,
  channelName,
  channelState,
})

const updateHistoryModuleAction = (
  moduleUuid: string, history: BuildInfo[]
): HistoryUpdateModuleAction => ({
  type: HISTORY_UPDATE_ACTION_TYPE,
  moduleUuid,
  history,
})

const updateTargetsModuleAction = (
  moduleUuid: string, targets: DependencyTargetsResponse
): TargetsUpdateModuleAction => ({
  type: TARGETS_UPDATE_ACTION_TYPE,
  moduleUuid,
  targets,
})

const updateVersionModuleAction = (
  moduleUuid: string, patches: VersionInfo[], prePatches?: VersionInfo[]
): VersionUpdateModuleAction => ({
  type: VERSION_UPDATE_ACTION_TYPE,
  moduleUuid,
  patches,
  prePatches,
})

const patchVersionModuleAction = (
  moduleUuid: string, version: VersionInfo
): VersionPatchModuleAction => ({
  type: VERSION_PATCH_ACTION_TYPE,
  moduleUuid,
  version,
})

const newVersionModuleAction = (
  moduleUuid: string, patch: VersionInfo
): VersionNewModuleAction => ({
  type: VERSION_NEW_ACTION_TYPE,
  moduleUuid,
  patch,
})

const updateModuleUserAction = (
  moduleUuid: string, moduleUser: Partial<IModuleUser>
): UpdateModuleUserAction => ({
  type: UPDATE_MODULE_USER_ACTION_TYPE,
  moduleUuid,
  moduleUser,
})

interface Crop {
  x: number
  y: number
  width: number
  height: number
}

type ModuleUpdates = {
  file?: File
  crop?: Crop
} & Partial<Pick<IModule, 'title'| 'description'| 'publicFeatured' | 'compatibility'>>

export {
  LIST_MODULES_ACTION_TYPE,
  LIST_PUBLIC_MODULES_ACTION_TYPE,
  LIST_PUBLIC_ACCOUNT_MODULES_ACTION_TYPE,
  PATCH_MODULES_ACTION_TYPE,
  CREATE_MODULES_ACTION_TYPE,
  CHANNEL_UPDATE_ACTION_TYPE,
  HISTORY_UPDATE_ACTION_TYPE,
  TARGETS_UPDATE_ACTION_TYPE,
  VERSION_UPDATE_ACTION_TYPE,
  VERSION_NEW_ACTION_TYPE,
  VERSION_PATCH_ACTION_TYPE,
  UPDATE_MODULE_USER_ACTION_TYPE,
  FETCH_PUBLIC_MODULE_ACTION_TYPE,
  MODULE_ACTION_TYPE,
  listModulesAction,
  listPublicModulesAction,
  listPublicBrowseModulesAction,
  patchModuleAction,
  createModuleAction,
  updateChannelModuleAction,
  updateHistoryModuleAction,
  updateTargetsModuleAction,
  updateModuleUserAction,
  updateVersionModuleAction,
  newVersionModuleAction,
  patchVersionModuleAction,
  fetchPublicModuleAction,
}

export type {
  ModuleUpdates,
  ListModulesAction,
  ListPublicModulesAction,
  ListPublicAccountModulesAction,
  PatchModuleAction,
  CreateModuleAction,
  ChannelUpdateModuleAction,
  HistoryUpdateModuleAction,
  TargetsUpdateModuleAction,
  VersionUpdateModuleAction,
  VersionNewModuleAction,
  VersionPatchModuleAction,
  UpdateModuleUserAction,
  ModuleActions,
  FetchPublicModuleAction,
}
