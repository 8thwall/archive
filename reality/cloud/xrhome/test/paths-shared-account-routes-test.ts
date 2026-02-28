import {matchPath} from 'react-router'
import {assert} from 'chai'
import {v4 as uuidv4} from 'uuid'

import type {
  IAccount, IApp, ICrossAccountPermission, IExternalAccount,
} from '../src/client/common/types/models'
import type {RootState} from '../src/client/reducer'
import type {AccountState} from '../src/client/accounts/account-reducer'
import {
  getRouteAccount, getRouteApp, getRouteMemberAccount, getRouteExternalAccount,
} from '../src/client/common/paths'

const createAccount = (shortName: string): Partial<IAccount> => ({
  uuid: uuidv4(),
  shortName,
  accountType: 'WebAgency',
})

const createApp = (appName: string, AccountUuid: string): Partial<IApp> => ({
  uuid: uuidv4(),
  appName,
  AccountUuid,
})

const createExternalAccount = (account: Partial<IAccount>): IExternalAccount => ({
  uuid: account.uuid,
  name: account.name,
  icon: account.icon,
  shortName: account.shortName,
  accountType: account.accountType,
})

const createCrossAccountPermission = (
  toAccount: Partial<IAccount>,
  fromAccount: Partial<IAccount>,
  app: Partial<IApp>
): ICrossAccountPermission => ({
  uuid: app.uuid,
  ToAccountUuid: toAccount.uuid,
  ToAccount: createExternalAccount(toAccount),
  FromAccountUuid: fromAccount.uuid,
  FromAccount: createExternalAccount(fromAccount),
  AppUuid: app.uuid,
  status: 'ACTIVE',
  invitedAt: (new Date()).toString(),
  createdAt: (new Date()).toString(),
  updatedAt: (new Date()).toString(),
})

/**
 * This will create a mock Redux state that meets the following conditions:
 *   1. The user is a member of the 'alvin' workspace.
 *   2. The 'alvin' workspace owns an app called 'member-app'.
 *   3. The user is NOT a member of the '8w' workspace.
 *   4. The '8w' workspace owns an app called 'shared-app'.
 *   5. The '8w' workspace has shared the 'shared-app' with the 'alvin' workspace.
 */
const createState = (): Partial<RootState> => {
  const memberAccount = createAccount('alvin')
  const externalAccount = createAccount('8w')
  const memberApp = createApp('member-app', memberAccount.uuid)
  const sharedApp = createApp('shared-app', externalAccount.uuid)

  const accountState = {
    allAccounts: [{
      ...memberAccount,
      Apps: [memberApp],
    }],
    accountLoaded: true,
    selectedAccount: memberAccount.uuid,
  } as AccountState

  const crossAccountPermission = createCrossAccountPermission(
    memberAccount, externalAccount, sharedApp
  )

  return {
    accounts: accountState,
    apps: [memberApp, sharedApp],
    crossAccountPermissions: {
      entities: {
        [crossAccountPermission.uuid]: crossAccountPermission,
      },
      byFromAccountShortname: {
        [externalAccount.shortName]: [crossAccountPermission.uuid],
      },
      byAppUuid: {
        [sharedApp.uuid]: [crossAccountPermission.uuid],
      },
      pending: {},
      error: {},
    },
  }
}

describe('Paths - Account Routes Test', () => {
  let state
  beforeEach(() => {
    state = createState()
  })

  describe('When the matchPath is /:account/external/:externalAccount?/:routeAppName?', () => {
    describe('and the route is /alvin/external/8w/shared-app', () => {
      const match = matchPath('/alvin/external/8w/shared-app', {
        path: '/:account/external/:externalAccount?/:routeAppName?',
      })

      describe('and both accounts have an app with the same name', () => {
        let matchingMemberApp
        beforeEach(() => {
          const memberAccount = getRouteMemberAccount(state, match)
          matchingMemberApp = createApp('shared-app', memberAccount.uuid)
          state.apps = [matchingMemberApp, ...state.apps]
        })

        it('getRouteApp should not return the matching member app', () => {
          const app = getRouteApp(state, match)
          const account = getRouteExternalAccount(state, match)
          assert.exists(app)
          assert.equal(app.appName, 'shared-app')
          assert.notEqual(app.uuid, matchingMemberApp.uuid)
          assert.equal(app.AccountUuid, account.uuid)
        })
      })

      it('getRouteMemberAccount should return alvin', () => {
        const account = getRouteMemberAccount(state, match)
        assert.exists(account)
        assert.equal(account.shortName, 'alvin')
      })

      it('getRouteExternalAccount returns 8w', () => {
        const account = getRouteExternalAccount(state, match)
        assert.exists(account)
        assert.equal(account.shortName, '8w')
      })

      it('getRouteAccount should return 8w', () => {
        const account = getRouteAccount(state, match)
        assert.exists(account)
        assert.equal(account.shortName, '8w')
      })

      it('getRouteApp should return shared-app', () => {
        const app = getRouteApp(state, match)
        assert.exists(app)
        assert.equal(app.appName, 'shared-app')
      })
    })

    describe('and the route is /alvin/external/fakeaccount/shared-app/project', () => {
      const match = matchPath('/alvin/external/fakeaccount/shared-app/project', {
        path: '/:account/external/:externalAccount?/:routeAppName?',
      })

      it('getRouteMemberAccount should return alvin', () => {
        const account = getRouteMemberAccount(state, match)
        assert.exists(account)
        assert.equal(account.shortName, 'alvin')
      })

      it('getRouteExternalAccount returns null', () => {
        const account = getRouteExternalAccount(state, match)
        assert.notExists(account)
      })

      it('getRouteAccount should return null', () => {
        const account = getRouteAccount(state, match)
        assert.notExists(account)
      })

      it('getRouteApp should return null', () => {
        const app = getRouteApp(state, match)
        assert.notExists(app)
      })
    })
  })

  describe('When the matchPath is /:account/:routeAppName?/project', () => {
    describe('and the route is /alvin/shared-app/project', () => {
      const match = matchPath('/alvin/shared-app/project', {
        path: '/:account/:routeAppName?/project',
      })

      it('getRouteAccount should return alvin', () => {
        const account = getRouteAccount(state, match)
        assert.exists(account)
        assert.equal(account.shortName, 'alvin')
      })

      it('getRouteExternalAccount should return null', () => {
        const account = getRouteExternalAccount(state, match)
        assert.notExists(account)
      })

      it('getRouteApp should return null', () => {
        const app = getRouteApp(state, match)
        assert.notExists(app)
      })
    })

    describe('and the route is /alvin/member-app/project', () => {
      const match = matchPath('/alvin/member-app/project', {
        path: '/:account/:routeAppName?/project',
      })

      it('getRouteAccount should return alvin', () => {
        const account = getRouteAccount(state, match)
        assert.exists(account)
        assert.equal(account.shortName, 'alvin')
      })

      it('getRouteApp should return member-app', () => {
        const app = getRouteApp(state, match)
        assert.exists(app)
        assert.equal(app.appName, 'member-app')
      })
    })
  })
})
