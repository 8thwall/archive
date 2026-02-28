import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'
import {combineReducers} from 'redux'
import {LOCATION_CHANGE, RouterState, createReduxHistoryContext} from 'redux-first-history'
import {createBrowserHistory, createMemoryHistory} from 'history'

import {configureStore, EnhancedStore} from '@reduxjs/toolkit'

import type {DeepReadonly} from 'ts-essentials'

import {middleware as appsMiddleware} from './apps'
import {middleware as teamMiddleware} from './team'
import {middleware as userMiddleware} from './user'
import {middleware as usageMiddleware} from './usage'
import {middleware as billingMiddleware} from './billing'
import {middleware as contractsMiddleware} from './contracts'
import {middleware as apiKeysMiddleware} from './api-keys'
import {rawActions as userActions} from './user/user-actions'
import {rawActions as accountActions} from './accounts/account-actions'
import {rawActions as teamActions} from './team/team-actions'
import {rawActions as crossAccountPermissionsActions} from './cross-account-permissions/actions'
import {shouldLoadLightship} from './lightship/common/lightship-settings'
import {FULL_STACK_REDUCERS} from './full-stack-reducers'
import type {VersionChannel} from '../shared/xrweb-version-types'

// These values should match our _settings.scss
const MOBILE_WIDTH_BREAKPOINT = 1024
const TINY_WIDTH_BREAKPOINT = 767

const history = Build8.PLATFORM_TARGET === 'desktop'
  ? createMemoryHistory()
  : createBrowserHistory()
// Scroll to the top on every history change
if (typeof window !== 'undefined') {
  history.listen(() => window.scrollTo(0, 0))
}

const initialCommonState = {
  error: '',
  lightshipError: {errorCode: null},
  message: '',
  success: '',
  history,
  showNav: false,
  showBadges: false,
  sidebarExpandedAccounts: {},
  showToS: false,
  showMigrateUser: false,
  isTinyScreen: false,
  versions: <VersionChannel[]>[],
  errorMessage: '',
  interpolates: undefined as {} | undefined,
  isSmallScreen: false,
  desktopLoginReturnUrl: undefined as string,
  desktopDuplicateProjectReturnUrl: undefined as string,
}

type CommonState = DeepReadonly<typeof initialCommonState & {
  imageTargetPreview?: string | undefined
}>

const common = (state: CommonState = initialCommonState, action) => {
  switch (action.type) {
    case 'SHOW_TOS':
      return {...state, showToS: action.showToS}
    case 'SHOW_MIGRATE_USER':
      return {...state, showMigrateUser: action.showMigrateUser}
    case 'AUTHENTICATED':
      return {...state, authenticated: true}
    case 'USER_LOGOUT':
      return {...state, authenticated: false}
    case 'ERROR':
      return {...state, error: action.msg, interpolates: action.interpolates}
    case 'LIGHTSHIP_ERROR':
      return {
        ...state,
        lightshipError: {errorCode: action.errorCode},
      }
    case 'MESSAGE':
      return {...state, message: action.msg}
    case 'SUCCESS':
      return {...state, success: action.msg}
    case 'ACKNOWLEDGE_ERROR':
      return {...state, error: '', lightshipError: {errorCode: null}}
    case 'ACKNOWLEDGE_MESSAGE':
      return {...state, message: ''}
    case 'ACKNOWLEDGE_SUCCESS':
      return {...state, success: ''}

    case 'VERSIONS':
      return {...state, versions: action.versions}

    case 'APP_UPLOADING':
      return {...state, uploading: action.uploading}
    case 'APPS_DEV':
      return {
        ...state,
        devMode: action.AccountUuid !== 'none' && action.version,
        engineUrl: action.engineUrl,
      }

    case 'ACCOUNT_NEW_TYPE':
      return {...state, newAccountType: action.accountType}
    case 'ACCOUNT_NEW_PLAN_TYPE':
      return {...state, newAccountPlanType: action.accountPlanType}

    case 'IMAGE_TARGET_PREVIEW':
      return {...state, imageTargetPreview: action.url}
    case 'SHOW_NAV':
      return {...state, showNav: action.showNav}
    case 'SHOW_BADGES':
      return {...state, showBadges: action.showBadges}
    case LOCATION_CHANGE:
      return {
        ...state,
        showNav: false,
        showNavMenu: !(action.payload.location.state && action.payload.location.state.fullPage),
      }
    case 'LISTEN_WINDOW_RESIZE':
      return {
        ...state,
        isTinyScreen: action.width <= TINY_WIDTH_BREAKPOINT,
        isSmallScreen: action.width <= MOBILE_WIDTH_BREAKPOINT,
        showNav: action.width > MOBILE_WIDTH_BREAKPOINT ? false : state.showNav,
      }
    case 'ACCOUNTS_SET_ALL': {
      const sidebarExpandedAccounts = action.accounts.reduce((o, account) => {
        o[account.uuid] = false
        return o
      }, {} as Record<string, boolean>)
      return {...state, sidebarExpandedAccounts}
    }
    case 'SIDEBAR/TOGGLE_ACCOUNT_EXPANDED': {
      const {accountUuid} = action
      const {sidebarExpandedAccounts} = state
      return {
        ...state,
        sidebarExpandedAccounts: {
          ...sidebarExpandedAccounts,
          [accountUuid]: !sidebarExpandedAccounts[accountUuid],
        },
      }
    }
    case 'SIDEBAR/EXPAND_ACCOUNT': {
      const {accountUuid} = action
      const {sidebarExpandedAccounts} = state
      return {
        ...state,
        sidebarExpandedAccounts: {
          ...sidebarExpandedAccounts,
          [accountUuid]: true,
        },
      }
    }
    case 'DESKTOP_LOGIN_RETURN_URL': {
      const {url} = action
      return {
        ...state,
        desktopLoginReturnUrl: url,
      }
    }
    case 'DESKTOP_DUPLICATE_PROJECT_RETURN_URL': {
      const {url} = action
      return {
        ...state,
        desktopDuplicateProjectReturnUrl: url,
      }
    }
    default:
      return state
  }
}

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer,
} = createReduxHistoryContext({history})

const rootReducer = combineReducers<RootState>({
  ...FULL_STACK_REDUCERS,
  router: routerReducer,
  common,
})

type RootState = DeepReadonly<{
  router: RouterState
  common: Parameters<typeof common>[0]
} & {
  [k in keyof typeof FULL_STACK_REDUCERS]: Parameters<typeof FULL_STACK_REDUCERS[k]>[0]
}>

const initialize = async (dispatch) => {
  // This initialize function does not apply for firebase logins so we should early return.
  // Lightship handles auth through the AuthDataProvider HOC rather than userActions.intitialize()
  // Any initialize() like calls should be placed in AuthDataProvider.
  if (shouldLoadLightship()) {
    return
  }
  await Promise.all([
    // team initialization checks query string for invitation
    dispatch(teamActions.initialize()),
    (async () => {
      await dispatch(userActions.initialize())
      await dispatch(crossAccountPermissionsActions.initialize())
      await dispatch(accountActions.initialize())
    })(),
  ])
}

const reInitializer = store => next => (action) => {
  if (action.type === 'AUTHENTICATED') {
    store.dispatch(initialize)
  }
  next(action)
  if (action.type === 'ERROR' && action.msg) {
    setTimeout(() => store.dispatch({type: 'ACKNOWLEDGE_ERROR'}), 30000)
  }
  if (action.type === 'MESSAGE' && action.msg) {
    setTimeout(() => store.dispatch({type: 'ACKNOWLEDGE_MESSAGE'}), 30000)
  }
}

let store

type ExtendedStoreResult = {
  store: EnhancedStore<RootState>
  initializePromise: Promise<void>
}

const getExtendedStore = (preloadedState?: RootState): ExtendedStoreResult => {
  if (store) {
    return {
      store,
      initializePromise: Promise.resolve(),
    }
  }

  const middleware = [
    routerMiddleware,
    thunk,
  ]

  if (BuildIf.LOCAL_DEV && !BuildIf.UI_TEST && !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    middleware.push(createLogger())
  }

  middleware.push(reInitializer)

  middleware.push(...[
    appsMiddleware, teamMiddleware, userMiddleware, usageMiddleware, billingMiddleware,
    contractsMiddleware, apiKeysMiddleware,
  ].filter(Boolean))

  // Wrapper over createStore()
  // https://redux-toolkit.js.org/api/configureStore
  // https://redux.js.org/api/createstore
  store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware,
    devTools: BuildIf.ALL_QA || window.location.origin === 'https://www-rc.8thwall.com',
  })

  const initializePromise = store.dispatch(initialize)
  return {store, initializePromise}
}

const getStore = (preloadedState?: RootState): EnhancedStore<RootState> => (
  getExtendedStore(preloadedState).store
)

let connectedHistory: ReturnType<typeof createReduxHistory>
const getHistory = () => {
  if (!connectedHistory) {
    connectedHistory = createReduxHistory(getStore())
  }
  return connectedHistory
}

export {
  getHistory,
  getStore,
  getExtendedStore,
}

export type {
  RootState,
  CommonState,
}
