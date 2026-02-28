import uuid from 'uuid/v4'

import type {
  RouteConfig, GatewayDefinition, ProxyConfigFieldPatch, HeadersConfig, FunctionConfigFieldPatch,
  EnvVariableConfig,
} from '../../../shared/gateway/gateway-types'

type BackendConfigState = {
  onTopOf: string
  expectedNewFile?: string
  needsSave: boolean
  config: GatewayDefinition
}

const fileChangeAction = (content: string) => ({type: 'FILE_CHANGE' as const, content})
const saveStartAction = (content: string) => ({type: 'SAVE_START' as const, content})
const newRouteAction = () => ({type: 'NEW_ROUTE' as const})
const deleteRouteAction = (routeId: string) => ({type: 'DELETE_ROUTE' as const, routeId})
const patchEnvVariablesAction = (envVariables: EnvVariableConfig) => (
  {type: 'UPDATE_ENV_VARS' as const, envVariables}
)
const deleteEnvVariableAction = (envVariableName: string) => (
  {type: 'DELETE_ENV_VAR' as const, envVariableName}
)
const patchHeadersAction = (headers: HeadersConfig, routeId = '') => (
  {type: 'UPDATE_HEADERS' as const, headers, routeId}
)
const deleteHeaderAction = (headerName: string, routeId = '') => (
  {type: 'DELETE_HEADER' as const, headerName, routeId}
)
const patchProxyFieldAction = (update: ProxyConfigFieldPatch, routeId = '') => (
  {type: 'UPDATE_PROXY_FIELD' as const, update, routeId}
)
const patchFunctionFieldAction = (update: FunctionConfigFieldPatch, routeId = '') => (
  {type: 'UPDATE_FUNCTION_FIELD' as const, update, routeId}
)

type FileChangeAction = ReturnType<typeof fileChangeAction>
type SaveStartAction = ReturnType<typeof saveStartAction>
type NewRouteAction = ReturnType<typeof newRouteAction>
type DeleteRouteAction = ReturnType<typeof deleteRouteAction>
type PatchEnvVariablesAction = ReturnType<typeof patchEnvVariablesAction>
type DeleteEnvVariableAction = ReturnType<typeof deleteEnvVariableAction>
type PatchHeadersAction = ReturnType<typeof patchHeadersAction>
type DeleteHeaderAction = ReturnType<typeof deleteHeaderAction>
type PatchProxyFieldAction = ReturnType<typeof patchProxyFieldAction>
type PatchFunctionFieldAction = ReturnType<typeof patchFunctionFieldAction>

type BackendConfigAction = FileChangeAction | SaveStartAction |
NewRouteAction | DeleteRouteAction |
PatchHeadersAction | DeleteHeaderAction | PatchProxyFieldAction | PatchFunctionFieldAction |
PatchEnvVariablesAction | DeleteEnvVariableAction

const safeParseConfig = (content: string): GatewayDefinition => {
  try {
    const backendConfig: GatewayDefinition = JSON.parse(content)
    if (backendConfig && typeof backendConfig === 'object') {
      return backendConfig
    }
  } catch (err) {
    // ???
  }
  return {name: '', routes: []}
}

const makeUnexpectedActionError = (action: any) => (
  new Error(`Unexpected action in backendConfigReducer: ${action.type}`)
)

const backendConfigBuilderReducer = (
  state: BackendConfigState,
  action: BackendConfigAction
): BackendConfigState => {
  switch (action.type) {
    case 'FILE_CHANGE': {
      if (state.expectedNewFile === action.content) {
        return {...state, onTopOf: action.content, expectedNewFile: undefined}
      } else {
        try {
          return {
            ...state,
            onTopOf: action.content,
            config: safeParseConfig(action.content),
            needsSave: false,
          }
        } catch (err) {
          return state
        }
      }
    }
    case 'SAVE_START':
      return {...state, expectedNewFile: action.content, needsSave: false}
    case 'NEW_ROUTE': {
      if (state.config.type === 'function') {
        throw makeUnexpectedActionError(action)
      }
      const newRoute: RouteConfig = {
        name: '',
        id: uuid(),
        url: '',
        methods: ['GET'],
        headers: {},
      }
      const newRoutes = [newRoute, ...state.config.routes]
      const newConfig = {...state.config, routes: newRoutes}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'DELETE_ROUTE': {
      if (state.config.type === 'function') {
        throw makeUnexpectedActionError(action)
      }
      const newConfig = {
        ...state.config,
        routes: [...state.config.routes.filter(route => route.id !== action.routeId)],
      }
      return {...state, config: newConfig, needsSave: true}
    }
    case 'UPDATE_ENV_VARS': {
      if (state.config.type === 'proxy') {
        throw makeUnexpectedActionError(action)
      }
      const newEnvVariables = {...state.config.envVariables, ...action.envVariables}
      const newConfig = {...state.config, envVariables: newEnvVariables}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'DELETE_ENV_VAR': {
      if (state.config.type === 'proxy') {
        throw makeUnexpectedActionError(action)
      }

      const newEnvVariables = {...state.config.envVariables}
      delete newEnvVariables[action.envVariableName]
      const newConfig = {...state.config, envVariables: newEnvVariables}
      return {...state, config: newConfig, needsSave: true}
    }
    case 'UPDATE_HEADERS': {
      if (!action.routeId) {
        const newHeaders = {...state.config.headers, ...action.headers}
        const newConfig = {...state.config, headers: newHeaders}
        return {...state, config: newConfig, needsSave: true}
      }

      // Route specific headers are not supported in backend functions.
      if (state.config.type === 'function') {
        throw makeUnexpectedActionError(action)
      }

      // Update headers for proxy routes.
      const newConfig = {
        ...state.config,
        routes: [...state.config.routes.map(
          route => (route.id === action.routeId
            ? {...route, headers: {...route.headers, ...action.headers}}
            : route)
        )],
      }
      return {...state, config: newConfig, needsSave: true}
    }
    case 'DELETE_HEADER': {
      if (!action.routeId) {
        const newHeaders = {...state.config.headers}
        delete newHeaders[action.headerName]
        const newConfig = {...state.config, headers: newHeaders}
        return {...state, config: newConfig, needsSave: true}
      }

      // Route specific headers are not supported in backend functions.
      if (state.config.type === 'function') {
        throw makeUnexpectedActionError(action)
      }

      // Delete headers for proxy routes.
      const newConfig = {
        ...state.config,
        routes: [...state.config.routes.map(
          (route) => {
            if (route.id === action.routeId) {
              const newHeaders = {...route.headers}
              delete newHeaders[action.headerName]
              return {...route, headers: newHeaders}
            }
            return route
          }
        )],
      }
      return {...state, config: newConfig, needsSave: true}
    }
    case 'UPDATE_PROXY_FIELD': {
      if (state.config.type === 'function') {
        throw makeUnexpectedActionError(action)
      }
      const {update, routeId} = action
      if (!routeId) {
        const newConfig = {...state.config, ...update}
        return {...state, config: newConfig, needsSave: true}
      }
      const newConfig = {
        ...state.config,
        routes: [...state.config.routes.map(
          route => (route.id === routeId ? {...route, ...update} : route)
        )],
      }
      return {...state, config: newConfig, needsSave: true}
    }
    case 'UPDATE_FUNCTION_FIELD': {
      if (state.config.type !== 'function') {
        throw makeUnexpectedActionError(action)
      }

      const {update} = action
      const newConfig = {...state.config, ...update}
      return {...state, config: newConfig, needsSave: true}
    }
    default:
      throw new Error(`Unexpected action in backendConfigReducer: ${(action as any).type}`)
  }
}

const initBackendConfigState = (fileContent: string): BackendConfigState => ({
  config: safeParseConfig(fileContent),
  onTopOf: fileContent,
  needsSave: false,
})

export {
  fileChangeAction,
  saveStartAction,
  newRouteAction,
  deleteRouteAction,
  patchEnvVariablesAction,
  deleteEnvVariableAction,
  patchHeadersAction,
  deleteHeaderAction,
  patchProxyFieldAction,
  patchFunctionFieldAction,
  backendConfigBuilderReducer,
  initBackendConfigState,
}

export type {
  BackendConfigAction,
}
