import type {DeepReadonly} from 'ts-essentials'

import {mergeDependencySets} from '../../../shared/module/merge-dependency-sets'

import type {ModuleDependency} from '../../../shared/module/module-dependency'
import type {DependenciesById} from '../../../shared/module/validate-app-dependencies'

type LastUserEdit = {timestamp: number, userName: string}
type LastUserEdits =Record<string, LastUserEdit>

type State = {
  dependenciesById: DependenciesById
  previousDependenciesById: DependenciesById
  isLoaded: boolean
  modifiedDependencies: string[]
  lastUserEdits: LastUserEdits
  didRefresh?: boolean
}

type DependencyUpdater = (
  Partial<ModuleDependency> |
  ((current: DeepReadonly<ModuleDependency>) => Partial<ModuleDependency>)
)

type SettingsUpdateActionData = DeepReadonly<{
  userName: string
  dependencyIds: string[]
}>

const addDependency = (dependency: ModuleDependency) => ({
  type: 'ADD_DEPENDENCY'as const, dependency,
})
const updateDependency = (dependencyId: string, update: DependencyUpdater) => ({
  type: 'UPDATE_DEPENDENCY'as const, dependencyId, update,
})
const deleteDependency = (dependencyId: string) => ({
  type: 'DELETE_DEPENDENCY'as const, dependencyId,
})
const fullLoad = (dependenciesById: DependenciesById) => ({
  type: 'FULL_LOAD'as const, dependenciesById,
})
const refresh = (dependenciesById: DependenciesById) => ({
  type: 'REFRESH'as const, dependenciesById,
})
const confirmRefresh = () => ({
  type: 'CONFIRM_REFRESH' as const,
})
const liveSettingsUpdate = (data: SettingsUpdateActionData, timestamp: number) => ({
  ...data, type: 'LIVE_SETTINGS_UPDATE' as const, timestamp,
})

 type AddDependencyAction = ReturnType<typeof addDependency>
 type UpdateDependencyAction = ReturnType<typeof updateDependency>
 type DeleteDependencyAction = ReturnType<typeof deleteDependency>
 type FullLoadAction = ReturnType<typeof fullLoad>
 type RefreshAction = ReturnType<typeof refresh>
type LiveSettingsUpdateAction = ReturnType<typeof liveSettingsUpdate>
type ConfirmRefreshAction = ReturnType<typeof confirmRefresh>

type Action = AddDependencyAction | DeleteDependencyAction | UpdateDependencyAction | FullLoadAction
  | RefreshAction | LiveSettingsUpdateAction | ConfirmRefreshAction

const addDirtyDependency = (current: DeepReadonly<string[]>, newId: string) => {
  if (current.includes(newId)) {
    return current
  }
  return [...current, newId]
}

const handleDependencyUpdate = (
  state: DeepReadonly<State>, dependencyId: string, updater: DependencyUpdater
): DeepReadonly<State> => {
  const oldDependency = state.dependenciesById[dependencyId]
  if (!oldDependency) {
    return state
  }
  const dependencyCopy = {...oldDependency}
  const returnedDependency = typeof updater === 'function' ? updater(dependencyCopy) : updater
  if (returnedDependency) {
    Object.assign(dependencyCopy, returnedDependency)
  }
  return {
    ...state,
    dependenciesById: {...state.dependenciesById, [dependencyId]: dependencyCopy},
    modifiedDependencies: addDirtyDependency(state.modifiedDependencies, dependencyId),
  }
}

const reducer = (state: DeepReadonly<State>, action: Action): DeepReadonly<State> => {
  switch (action.type) {
    case 'ADD_DEPENDENCY': {
      const newDependenciesById = {...state.dependenciesById}
      const {dependencyId} = action.dependency
      newDependenciesById[dependencyId] = action.dependency
      return {
        ...state,
        dependenciesById: newDependenciesById,
        modifiedDependencies: addDirtyDependency(state.modifiedDependencies, dependencyId),
      }
    }
    case 'DELETE_DEPENDENCY': {
      const newDependenciesById = {...state.dependenciesById}
      delete newDependenciesById[action.dependencyId]
      return {...state, dependenciesById: newDependenciesById}
    }
    case 'UPDATE_DEPENDENCY': {
      return handleDependencyUpdate(state, action.dependencyId, action.update)
    }
    case 'FULL_LOAD':
      return {
        ...state,
        dependenciesById: action.dependenciesById,
        previousDependenciesById: action.dependenciesById,
        isLoaded: true,
        modifiedDependencies: [],
        lastUserEdits: state.modifiedDependencies.reduce((acc, d) => {
          delete acc[d]
          return acc
        }, {...state.lastUserEdits}),
      }
    case 'REFRESH':
      if (!state.isLoaded) {
        return state
      }
      return {
        ...state,
        dependenciesById: mergeDependencySets(
          state.previousDependenciesById,
          action.dependenciesById,
          state.dependenciesById
        ),
        previousDependenciesById: action.dependenciesById,
        didRefresh: true,
      }
    case 'CONFIRM_REFRESH':
      if (!state.isLoaded) {
        return state
      }
      return {
        ...state,
        didRefresh: false,
      }
    case 'LIVE_SETTINGS_UPDATE':
      return {
        ...state,
        lastUserEdits: action.dependencyIds.reduce((acc, d) => {
          acc[d] = {userName: action.userName, timestamp: action.timestamp}
          return acc
        }, {...state.lastUserEdits}),
      }
    default:
      throw new Error(`Unexpected action in external dependencies reducer: ${(action as any).type}`)
  }
}

export {
  addDependency,
  updateDependency,
  deleteDependency,
  fullLoad,
  refresh,
  reducer,
  liveSettingsUpdate,
  confirmRefresh,
}

export type {
  DependencyUpdater,
  State,
  SettingsUpdateActionData,
  LastUserEdit,
  LastUserEdits,
}
