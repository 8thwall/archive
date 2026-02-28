import {assert} from 'chai'
import {v4 as uuidv4} from 'uuid'

import {
  createCrossAccountPermission, createExternalAccount,
} from './common/cross-account-permission-mocks'
import {listPermissionsAction} from '../src/client/cross-account-permissions/action-types'
import {reducer} from '../src/client/cross-account-permissions/reducer'
import type {ICrossAccountPermission} from '../src/client/common/types/models'

const createListResponse = (permissions: ICrossAccountPermission[]) => (
  permissions.reduce((acc, permission) => {
    acc[permission.uuid] = permission
    return acc
  }, {})
)

describe('Cross Account Permissions Reducer - List Permissions Test', () => {
  let toAccount
  let fromAccount

  beforeEach(() => {
    toAccount = createExternalAccount('alvin')
    fromAccount = createExternalAccount('8w')
  })

  describe('when the state is empty', () => {
    describe('and a single permission returned on list', () => {
      let action
      let permission

      beforeEach(() => {
        permission = createCrossAccountPermission(toAccount, fromAccount, uuidv4())
        action = listPermissionsAction(createListResponse([permission]))
      })

      it('should exist in the entities object', () => {
        const newState = reducer(undefined, action)
        assert.equal(Object.keys(newState.entities).length, 1)
        assert.equal(newState.entities[permission.uuid].uuid, permission.uuid)
      })

      it('should exist in the byFromAccountShortname object', () => {
        const newState = reducer(undefined, action)
        assert.equal(Object.keys(newState.byFromAccountShortname).length, 1)

        const permissions = newState.byFromAccountShortname[fromAccount.shortName]
        assert.exists(permissions)
        assert.equal(permissions.length, 1)
        assert.isTrue(permissions.includes(permission.uuid))
      })

      it('should exist in the byAppUuid object', () => {
        const newState = reducer(undefined, action)
        assert.equal(Object.keys(newState.byAppUuid).length, 1)

        const permissions = newState.byAppUuid[permission.AppUuid]
        assert.exists(permissions)
        assert.equal(permissions.length, 1)
        assert.isTrue(permissions.includes(permission.uuid))
      })
    })

    describe('and multiple permissions are returned on list', () => {
      let action
      let permission

      beforeEach(() => {
        permission = createCrossAccountPermission(toAccount, fromAccount, uuidv4())
      })

      describe('where the FromAccounts and AppUuids match', () => {
        let permission2
        beforeEach(() => {
          const newToAccount = createExternalAccount('ghost')
          permission2 = createCrossAccountPermission(newToAccount, fromAccount, permission.AppUuid)
          action = listPermissionsAction(createListResponse([permission, permission2]))
        })

        it('they should appear in the entities object as separate keys', () => {
          const newState = reducer(undefined, action)
          assert.equal(Object.keys(newState.entities).length, 2)
          assert.equal(newState.entities[permission.uuid].uuid, permission.uuid)
          assert.equal(newState.entities[permission2.uuid].uuid, permission2.uuid)
        })

        it('they should appear under the same key in byFromAccountShortname', () => {
          const newState = reducer(undefined, action)
          assert.equal(1, Object.keys(newState.byFromAccountShortname).length)

          const permissions = newState.byFromAccountShortname[permission.FromAccount.shortName]
          assert.equal(permissions.length, 2)
        })

        it('they should appear under the same key in byAppUuid', () => {
          const newState = reducer(undefined, action)
          assert.equal(1, Object.keys(newState.byAppUuid).length)

          const permissions = newState.byAppUuid[permission.AppUuid]
          assert.equal(permissions.length, 2)
        })
      })
    })
  })

  describe('when the state is not empty', () => {
    let previousState
    let action
    let permission

    beforeEach(() => {
      const oldPermission = createCrossAccountPermission(toAccount, fromAccount, uuidv4())
      const oldAction = listPermissionsAction(createListResponse([oldPermission]))
      previousState = reducer(undefined, oldAction)

      permission = createCrossAccountPermission(toAccount, fromAccount, uuidv4())
      action = listPermissionsAction(createListResponse([permission]))
    })

    it('should replace the existing state', () => {
      const newState = reducer(previousState, action)
      assert.doesNotHaveAnyKeys(newState.entities, previousState.entities)
    })
  })
})
