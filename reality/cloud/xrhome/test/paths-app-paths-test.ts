import {assert} from 'chai'

import {AppPathEnum, getPathForApp} from '../src/client/common/paths'
import type {IAccount, IApp} from '../src/client/common/types/models'

describe('Paths - App Paths Test', () => {
  describe('when the account is a string', () => {
    describe('and the app is a string', () => {
      it('getPathForApp without a third parameter returns the app path', () => {
        assert.equal(getPathForApp('alvin', 'cool-app'), '/alvin/cool-app/project')
      })

      it('getPathForApp with a third parameter returns the page path', () => {
        const path = getPathForApp('alvin', 'cool-app', AppPathEnum.settings)
        assert.equal(path, '/alvin/cool-app/settings')
      })
    })

    describe('and the app is an IApp', () => {
      const app = {appName: 'cool-app'} as IApp
      it('getPathForApp without a third parameter returns the app path', () => {
        assert.equal(getPathForApp('alvin', app), '/alvin/cool-app/project')
      })

      it('getPathForApp with a third parameter returns the page path', () => {
        const path = getPathForApp('alvin', app, AppPathEnum.settings)
        assert.equal(path, '/alvin/cool-app/settings')
      })
    })
  })

  describe('when the account is an IAccount', () => {
    const account = {shortName: 'alvin'} as IAccount

    describe('and the app is a string', () => {
      it('getPathForApp without a third parameter returns the app path', () => {
        assert.equal(getPathForApp(account, 'cool-app'), '/alvin/cool-app/project')
      })

      it('getPathForApp with a second parameter returns the page path', () => {
        const path = getPathForApp(account, 'cool-app', AppPathEnum.settings)
        assert.equal(path, '/alvin/cool-app/settings')
      })
    })

    describe('and the app is an IApp', () => {
      const app = {appName: 'cool-app'} as IApp
      it('getPathForApp without a third parameter returns the app path', () => {
        assert.equal(getPathForApp(account, app), '/alvin/cool-app/project')
      })

      it('getPathForApp with a third parameter returns the page path', () => {
        const path = getPathForApp(account, app, AppPathEnum.settings)
        assert.equal(path, '/alvin/cool-app/settings')
      })
    })
  })

  describe('when a member account is provided', () => {
    const member = {shortName: 'alvin'} as IAccount

    describe('and the app is a string', () => {
      it('getPathForApp without a third parameter returns the app path', () => {
        assert.equal(getPathForApp({member}, 'cool-app'), '/alvin/cool-app/project')
      })

      it('getPathForApp with a second parameter returns the page path', () => {
        const path = getPathForApp({member}, 'cool-app', AppPathEnum.settings)
        assert.equal(path, '/alvin/cool-app/settings')
      })
    })

    describe('and the app is an IApp', () => {
      const app = {appName: 'cool-app'} as IApp
      it('getPathForApp without a third parameter returns the app path', () => {
        assert.equal(getPathForApp({member}, app), '/alvin/cool-app/project')
      })

      it('getPathForApp with a third parameter returns the page path', () => {
        const path = getPathForApp({member}, app, AppPathEnum.settings)
        assert.equal(path, '/alvin/cool-app/settings')
      })
    })

    describe('with an external account', () => {
      const external = {shortName: 'ghost'} as IAccount
      describe('and the app is a string', () => {
        it('getPathForApp without a third parameter returns the app path', () => {
          const path = getPathForApp({member, external}, 'cool-app')
          assert.equal(path, '/alvin/external/ghost/cool-app/project')
        })

        it('getPathForApp with a second parameter returns the page path', () => {
          const path = getPathForApp({member, external}, 'cool-app', AppPathEnum.settings)
          assert.equal(path, '/alvin/external/ghost/cool-app/settings')
        })
      })

      describe('and the app is an IApp', () => {
        const app = {appName: 'cool-app'} as IApp
        it('getPathForApp without a third parameter returns the app path', () => {
          const path = getPathForApp({member, external}, app)
          assert.equal(path, '/alvin/external/ghost/cool-app/project')
        })

        it('getPathForApp with a third parameter returns the page path', () => {
          const path = getPathForApp({member, external}, app, AppPathEnum.settings)
          assert.equal(path, '/alvin/external/ghost/cool-app/settings')
        })
      })
    })
  })
})
