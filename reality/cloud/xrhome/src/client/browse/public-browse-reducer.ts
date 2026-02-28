import type {IPublicApp, IPublicAccount} from '../common/types/models'

interface PublicPathInfo {
  path: string
  type: 'file' | 'folder'
  fileName: string
  fileCommitDescription: string  // TODO(dat): Implement file commit description and time
  fileLastUpdated: number
}

type PublicBrowseState = {
  contentByPath: Record<string, string>
  listByPath: Record<string, PublicPathInfo[]>
  // Apps: Array of app uuids
  // address: loaded by getAccountAddress
  Accounts: Record<string, IPublicAccount & {Apps: string[], address?: string}>
  Apps: Record<string, IPublicApp>
  accountByName: Record<string, string>
  appByName: Record<string, string>
  descriptionById: Record<string, string>
}

const initialState: PublicBrowseState = {
  contentByPath: {},
  listByPath: {},
  Accounts: {},
  Apps: {},
  accountByName: {},
  appByName: {},
  descriptionById: {},
}

const mergeApp = (currentApp, newApp) => ({
  ...currentApp,
  ...newApp,
})

const mergeAppEntities = (currentAppMap, newAppMap) => {
  if (!newAppMap) {
    return currentAppMap
  }
  const res = {...currentAppMap}
  Object.keys(newAppMap).forEach((updatedUuid) => {
    res[updatedUuid] = mergeApp(currentAppMap[updatedUuid], newAppMap[updatedUuid])
  })
  return res
}

const mergeAccount = (currentAccount, newAccount) => ({
  ...currentAccount,
  ...newAccount,
})

const mergeAccountEntities = (currentAccountsMap, newAccountsMap) => {
  if (!newAccountsMap) {
    return currentAccountsMap
  }
  const res = {...currentAccountsMap}
  Object.keys(newAccountsMap).forEach((updatedUuid) => {
    res[updatedUuid] = mergeAccount(currentAccountsMap[updatedUuid], newAccountsMap[updatedUuid])
  })
  return res
}

const handlers = {
  'BROWSE/SET_FEATURE_APP_DESCRIPTION': (state, action) => (
    {
      ...state,
      descriptionById: {
        ...state.descriptionById,
        [action.descriptionId]: action.description,
      },
    }
  ),
  'BROWSE_UPDATE_PATH_INDEX': (state, action) => (
    {
      ...state,
      listByPath: {
        ...state.listByPath,
        [action.path]: action.contentList,
      },
    }
  ),
  'BROWSE_UPDATE_FILE_CONTENT': (state, action) => (
    {
      ...state,
      contentByPath: {
        ...state.contentByPath,
        [action.path]: action.fileContent,
      },
    }
  ),
  'BROWSE_UPDATE_NORMALIZED_ENTITIES': (state, action) => (
    {
      ...state,
      Accounts: mergeAccountEntities(state.Accounts, action.normalizedData.entities.Accounts),
      Apps: mergeAppEntities(state.Apps, action.normalizedData.entities.Apps),
      ...action.indexUpdates,
    }
  ),
  'BROWSE_UPDATE_ADDRESS': (state, action) => {
    const {accountUuid, address} = action
    let account = state.Accounts[accountUuid]
    if (account) {
      account = {...account, address}
    }

    return {
      ...state,
      Accounts: {
        ...state.Accounts,
        [accountUuid]: account,
      },
    }
  },
}

const Reducer = (state = {...initialState}, action) => {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }
  return state
}

export default Reducer

export type {
  PublicPathInfo,
  PublicBrowseState,
}
