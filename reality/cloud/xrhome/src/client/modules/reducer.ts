import {
  compareBuildInfo, compareVersionInfo, isPreForPatch, moduleTargetsEqual,
} from '../../shared/module/compare-module-target'
import type {
  VersionInfo, DependencyTargetsResponse, BuildInfo,
} from '../../shared/module/module-target-api'

import type {IModule, IModuleUser, IPublicModule} from '../common/types/models'
import {
  LIST_MODULES_ACTION_TYPE,
  LIST_PUBLIC_MODULES_ACTION_TYPE,
  LIST_PUBLIC_ACCOUNT_MODULES_ACTION_TYPE,
  PATCH_MODULES_ACTION_TYPE,
  CREATE_MODULES_ACTION_TYPE,
  UPDATE_MODULE_USER_ACTION_TYPE,
  VERSION_UPDATE_ACTION_TYPE,
  VERSION_PATCH_ACTION_TYPE,
  VERSION_NEW_ACTION_TYPE,
  TARGETS_UPDATE_ACTION_TYPE,
  CHANNEL_UPDATE_ACTION_TYPE,
  HISTORY_UPDATE_ACTION_TYPE,
  FETCH_PUBLIC_MODULE_ACTION_TYPE,
  ModuleActions, ListModulesAction, PatchModuleAction, CreateModuleAction,
  ChannelUpdateModuleAction, VersionUpdateModuleAction, TargetsUpdateModuleAction,
  UpdateModuleUserAction, VersionNewModuleAction, ListPublicModulesAction,
  FetchPublicModuleAction, VersionPatchModuleAction, HistoryUpdateModuleAction,
  ListPublicAccountModulesAction,
} from './action-types'
import type {ModuleChannelState} from './redux-types'

type ChannelsForModule = Record<string, ModuleChannelState>

interface ModulesState {
  channels: Record<string, ChannelsForModule>
  versions: Record<string, {patchData: VersionInfo[], prePatchData: VersionInfo[]}>
  history: Record<string, BuildInfo[]>
  targets: Record<string, DependencyTargetsResponse>
  moduleUsers: Record<string, IModuleUser>
  entities: Record<string, IModule>
  publicEntities: Record<string, IPublicModule>
  byAccountUuid: Record<string, string[]>
  publicByAccountUuid: Record<string, string[]>
  publicUuids: string[]
}

const initialState: ModulesState = {
  entities: {},
  publicEntities: {},
  byAccountUuid: {},
  publicByAccountUuid: {},
  channels: {},
  history: {},
  versions: {},
  moduleUsers: {},
  targets: {},
  publicUuids: [],
}

const handlers: Record<string, (state: ModulesState, action: ModuleActions) => ModulesState> = {
  [LIST_MODULES_ACTION_TYPE]: (state: ModulesState, action: ListModulesAction) => {
    const newEntities = {...state.entities}
    action.modules.forEach((module) => {
      newEntities[module.uuid] = module
    })
    return {
      ...state,
      entities: newEntities,
      byAccountUuid: {
        ...state.byAccountUuid,
        [action.accountUuid]: action.modules.map(e => e.uuid),
      },
    }
  },
  [LIST_PUBLIC_MODULES_ACTION_TYPE]: (state: ModulesState, action: ListPublicModulesAction) => {
    const newPublicEntities = {...state.publicEntities}
    action.modules.forEach((module) => {
      newPublicEntities[module.uuid] = module
    })
    return {
      ...state,
      publicEntities: newPublicEntities,
      publicUuids: action.modules.map(e => e.uuid),
    }
  },
  [LIST_PUBLIC_ACCOUNT_MODULES_ACTION_TYPE]: (
    state: ModulesState, action: ListPublicAccountModulesAction
  ) => {
    const newPublicEntities = {...state.publicEntities}
    action.modules.forEach((module) => {
      newPublicEntities[module.uuid] = module
    })
    return {
      ...state,
      publicEntities: newPublicEntities,
      publicByAccountUuid: {
        ...state.publicByAccountUuid,
        [action.accountUuid]: action.modules.map(e => e.uuid),
      },

    }
  },
  [FETCH_PUBLIC_MODULE_ACTION_TYPE]: (state: ModulesState, action: FetchPublicModuleAction) => {
    const newPublicEntities = {...state.publicEntities}
    newPublicEntities[action.module.uuid] = action.module
    return {
      ...state,
      publicEntities: newPublicEntities,
    }
  },
  [PATCH_MODULES_ACTION_TYPE]: (state: ModulesState, action: PatchModuleAction) => {
    const newEntities = {...state.entities}
    newEntities[action.module.uuid] = {
      ...newEntities[action.module.uuid],
      ...action.module,
    }
    return {
      ...state,
      entities: newEntities,
      byAccountUuid: state.byAccountUuid,
    }
  },
  [CREATE_MODULES_ACTION_TYPE]: (state: ModulesState, action: CreateModuleAction) => {
    const newEntities = {...state.entities}
    const byAccountUuid_ = {...state.byAccountUuid}
    newEntities[action.module.uuid] = action.module
    byAccountUuid_[action.accountUuid].push(action.module.uuid)
    return {
      ...state,
      entities: newEntities,
      byAccountUuid: byAccountUuid_,
    }
  },
  [CHANNEL_UPDATE_ACTION_TYPE]: (state: ModulesState, action: ChannelUpdateModuleAction) => {
    const newModuleChannels: ChannelsForModule = {
      ...state.channels[action.moduleUuid],
      [action.channelName]: action.channelState,
    }

    return {
      ...state,
      channels: {
        ...state.channels,
        [action.moduleUuid]: newModuleChannels,
      },
    }
  },
  [HISTORY_UPDATE_ACTION_TYPE]: (state: ModulesState, action: HistoryUpdateModuleAction) => ({
    ...state,
    history: {
      ...state.history,
      [action.moduleUuid]: action.history.sort(compareBuildInfo),
    },
  }),
  [TARGETS_UPDATE_ACTION_TYPE]: (state: ModulesState, action: TargetsUpdateModuleAction) => {
    const targetList: DependencyTargetsResponse = {
      betaChannel: undefined, commits: undefined, versions: [],
    }
    if (action.targets.betaChannel) {
      targetList.betaChannel = action.targets.betaChannel
    }
    if (action.targets.commits) {
      targetList.commits = action.targets.commits.sort(compareBuildInfo)
    }
    targetList.versions = action.targets.versions.sort(compareVersionInfo)
    targetList.preVersions = action.targets.preVersions?.sort(compareVersionInfo)

    return {
      ...state,
      targets: {
        ...state.targets,
        [action.moduleUuid]: targetList,
      },
    }
  },
  [VERSION_UPDATE_ACTION_TYPE]: (state: ModulesState, action: VersionUpdateModuleAction) => ({
    ...state,
    versions: {
      ...state.versions,
      [action.moduleUuid]: {
        patchData: action.patches,
        prePatchData: action.prePatches || [],
      },
    },
  }),
  [VERSION_PATCH_ACTION_TYPE]: (state: ModulesState, action: VersionPatchModuleAction) => {
    if (action.version.patchTarget.level !== 'patch') {
      return state
    }

    const currentPatches = state.versions[action.moduleUuid]
    if (!currentPatches) {
      return state
    }

    let newPrePatchData = currentPatches.prePatchData
    let newPatchData = currentPatches.patchData

    if (action.version.patchTarget.pre) {
      newPrePatchData = currentPatches.prePatchData
        .filter(p => !moduleTargetsEqual(p.patchTarget, action.version.patchTarget))
      newPrePatchData.push(action.version)
    } else {
      newPatchData = currentPatches.patchData
        .filter(p => !moduleTargetsEqual(p.patchTarget, action.version.patchTarget))
      newPatchData.push(action.version)
    }

    return {
      ...state,
      versions: {
        ...state.versions,
        [action.moduleUuid]: {
          prePatchData: newPrePatchData,
          patchData: newPatchData,
        },
      },
    }
  },
  [VERSION_NEW_ACTION_TYPE]: (state: ModulesState, action: VersionNewModuleAction) => {
    const currentPatches = state.versions[action.moduleUuid]
    if (!currentPatches) {
      return state
    }

    if (action.patch.patchTarget.pre) {
      const newPrePatchData = currentPatches.prePatchData.filter(e => (
        !moduleTargetsEqual(e.patchTarget, action.patch.patchTarget)
      ))
      return {
        ...state,
        versions: {
          ...state.versions,
          [action.moduleUuid]: {
            ...currentPatches,
            prePatchData: [...newPrePatchData, action.patch],
          },
        },
      }
    } else {
      // When a new release is finalized, it must be removed from the list of pre-existing versions
      // if present.
      const newPrePatchData = currentPatches.prePatchData.filter(e => (
        !isPreForPatch(e.patchTarget, action.patch.patchTarget)
      ))
      return {
        ...state,
        versions: {
          ...state.versions,
          [action.moduleUuid]: {
            prePatchData: newPrePatchData,
            patchData: [...currentPatches.patchData, action.patch],
          },
        },
      }
    }
  },
  [UPDATE_MODULE_USER_ACTION_TYPE]: (state: ModulesState, action: UpdateModuleUserAction) => {
    const newModuleUsers = {...state.moduleUsers}
    newModuleUsers[action.moduleUuid] = {
      ...newModuleUsers[action.moduleUuid],
      ...action.moduleUser,
    }
    return {
      ...state,
      moduleUsers: newModuleUsers,
    }
  },
}

const reducer = (state = {...initialState}, action: ModuleActions) => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }
  return state
}

export {
  ModulesState,
  reducer,
}
