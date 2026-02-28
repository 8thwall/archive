import {useEffect} from 'react'
import i18n from 'i18next'

import {getPlanTypeForAccountType} from '../../shared/account-utils'
import type {IUser} from '../user/user-actions'
import type {IAccount} from './types/models'
import {useCurrentUser, useUserHasSession} from '../user/use-current-user'

let currentAccount: IAccount = null
let currentUser: IUser = null

const refreshPendoData = () => {
  const {pendo} = window
  if (!pendo || !currentUser) {
    return
  }
  const params = {
    events: {
      guidesLoaded: () => {
        const hideResourceCenterOffClick = (e) => {
          const tgt = e.target
          const path = e.composedPath()
          let resourceCenterDescendant = false
          for (let i = 0; i < path.length; i++) {
            if (path[i].id === 'pendo-resource-center-container') {
              resourceCenterDescendant = true
            }
          }
          if ((pendo.dom('#pendo-resource-center-container') as HTMLElement[]).length &&
          !resourceCenterDescendant &&
          !(pendo.dom(tgt) as HTMLElement).closest(
            pendo.BuildingBlocks.BuildingBlockResourceCenter.getResourceCenter()
              .steps[0].elementPathRule
          ).length) {
            pendo.BuildingBlocks.BuildingBlockResourceCenter.dismissResourceCenter()
          }
        }
        pendo.attachEvent(document, 'click', hideResourceCenterOffClick)

        const displayResourceCenterSearchBar = (e) => {
          const path = e.composedPath()
          let resourceCenterDescendant = false
          for (let i = 0; i < path.length; i++) {
            if (path[i].id === 'pendo-resource-center-container') {
              resourceCenterDescendant = true
            }
          }
          if ((pendo.dom('._pendo-resource-center-home-list') as HTMLElement[]).length &&
            !(pendo.dom('#resource-center-search') as HTMLElement[]).length &&
            resourceCenterDescendant
          ) {
            const event = new CustomEvent('load-searchbar', {detail: {loadSearchBar: true}})
            window.dispatchEvent(event)
          }
        }
        pendo.attachEvent(document, 'click', displayResourceCenterSearchBar)
      },
    },
    visitor: {
      id: currentUser.uuid,
      email: currentUser.email,
      locale: i18n.language,
    },
    account: {
      id: currentAccount?.uuid,
      name: currentAccount?.name,
      workspace: currentAccount?.shortName,
      // TODO (tri): remove these in favor of cdc
      planLevel: currentAccount?.accountType
        ? getPlanTypeForAccountType(currentAccount?.accountType)
        : null,
      // eslint-disable-next-line local-rules/hardcoded-copy
      violationStatus: currentAccount?.violationStatus === 'Violation' || null,
    },
  }
  if (typeof pendo.isReady === 'function' && pendo.isReady()) {
    pendo.identify(params)
  } else {
    pendo.initialize(params)
  }
}

const usePendo = () => {
  const user = useCurrentUser()
  const isLoggedIn = useUserHasSession()

  useEffect(() => {
    if (isLoggedIn) {
      currentUser = user
    } else {
      currentUser = null
    }
    refreshPendoData()
  }, [window.pendo, user, isLoggedIn])
}

const usePendoAccountEffect = (account: IAccount) => {
  useEffect(() => {
    if (!account) {
      return undefined
    }
    if (currentAccount) {
      return undefined
    }
    currentAccount = account
    refreshPendoData()
    return () => {
      if (currentAccount === account) {
        currentAccount = null
        refreshPendoData()
      }
    }
  }, [account])
}

// Disable all Pendo guides for a logged-in page
const usePendoDisableGuides = () => {
  useEffect(() => {
    const {pendo} = window
    if (!pendo || !currentUser) {  // Match the checks in refreshPendoData()
      return undefined
    }
    pendo.setGuidesDisabled(true)
    pendo.stopGuides()
    return () => {
      pendo.setGuidesDisabled(false)
      pendo.startGuides()
    }
  }, [])
}

export {
  usePendo as default,
  usePendoAccountEffect,
  usePendoDisableGuides,
}
