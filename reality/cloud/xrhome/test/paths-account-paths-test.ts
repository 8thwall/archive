import {assert} from 'chai'

import {AccountPathEnum, getPathForAccount} from '../src/client/common/paths'
import type {IAccount} from '../src/client/common/types/models'

describe('Paths - Account Paths Test', () => {
  describe('when the account is a string', () => {
    it('getPathForAccount without a second parameter returns the workspace path', () => {
      assert.equal(getPathForAccount('alvin'), '/alvin/workspace')
    })

    it('getPathForAccount with a second parameter returns the page path', () => {
      assert.equal(getPathForAccount('alvin', AccountPathEnum.team), '/alvin/team')
    })
  })

  describe('when the account is an IAccount', () => {
    const account = {shortName: 'alvin'} as IAccount

    it('getPathForAccount without a second parameter returns the workspace path', () => {
      assert.equal(getPathForAccount(account), '/alvin/workspace')
    })

    it('getPathForAccount with a second parameter returns the page path', () => {
      assert.equal(getPathForAccount(account, AccountPathEnum.team), '/alvin/team')
    })
  })

  describe('when a member account is provided', () => {
    const member = {shortName: 'alvin'} as IAccount

    it('getPathForAccount without a second parameter returns the workspace path', () => {
      assert.equal(getPathForAccount({member}), '/alvin/workspace')
    })

    it('getPathForAccount with a second parameter returns the page path', () => {
      assert.equal(getPathForAccount({member}, AccountPathEnum.team), '/alvin/team')
    })

    describe('with a NULL external account', () => {
      it('getPathForAccount without a second parameter returns the workspace path', () => {
        assert.equal(getPathForAccount({member, external: null}), '/alvin/workspace')
      })

      it('getPathForAccount with a second parameter returns the page path', () => {
        assert.equal(
          getPathForAccount({member, external: null}, AccountPathEnum.team),
          '/alvin/team'
        )
      })
    })

    describe('with an external account', () => {
      const external = {shortName: 'ghost'} as IAccount

      it('getPathForAccount without a second parameter returns the workspace path', () => {
        const path = getPathForAccount({member, external})
        assert.equal(path, '/alvin/external/ghost/workspace')
      })

      it('getPathForAccount with a second parameter returns the page path', () => {
        const path = getPathForAccount({member, external}, AccountPathEnum.team)
        assert.equal(path, '/alvin/external/ghost/team')
      })
    })
  })
})
