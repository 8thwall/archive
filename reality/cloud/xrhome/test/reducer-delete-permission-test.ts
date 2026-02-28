import {assert} from 'chai'
import {v4 as uuidv4} from 'uuid'

import {
  createCrossAccountPermission, createExternalAccount,
} from './common/cross-account-permission-mocks'
import {
  deletePermissionAction, listPermissionsAction,
} from '../src/client/cross-account-permissions/action-types'
import {reducer} from '../src/client/cross-account-permissions/reducer'
import type {ICrossAccountPermission} from '../src/client/common/types/models'

const createListResponse = (permissions: ICrossAccountPermission[]) => (
  permissions.reduce((acc, permission) => {
    acc[permission.uuid] = permission
    return acc
  }, {})
)

describe('Cross Account Permissions Reducer - Delete Permissions Test', () => {
  let toAccount
  let toAccount2
  let fromAccount

  beforeEach(() => {
    toAccount = createExternalAccount('brandon')
    toAccount2 = createExternalAccount('alvin')
    fromAccount = createExternalAccount('8w')
  })

  describe('when the state has multiple permissions for the same app present', () => {
    let action
    let permission1
    let permission2
    let prevState
    const appUuid = uuidv4()

    beforeEach(() => {
      permission1 = createCrossAccountPermission(toAccount, fromAccount, appUuid)
      permission2 = createCrossAccountPermission(toAccount2, fromAccount, appUuid)

      prevState = reducer(
        undefined, listPermissionsAction(createListResponse([permission1, permission2]))
      )
      action = deletePermissionAction(permission1)
    })

    it('should not remove permissions not specified to be removed from entities', () => {
      const newState = reducer(prevState, action)
      assert.property(newState.entities, permission2.uuid)
    })

    it('should remove the specified permission from entities', () => {
      const newState = reducer(prevState, action)
      assert.notProperty(newState.entities, permission1.uuid)
    })

    it('should not remove uuids not specified to be removed from ByFromAccountShortname', () => {
      const newState = reducer(prevState, action)
      assert.include(newState.byFromAccountShortname[fromAccount.shortName], permission2.uuid)
    })

    it('should remove the specified permission uuid from ByFromAccountShortname', () => {
      const newState = reducer(prevState, action)
      assert.notInclude(newState.byFromAccountShortname[fromAccount.shortName], permission1.uuid)
    })

    it('should not remove uuids not specified to be removed from ByAppUuid', () => {
      const newState = reducer(prevState, action)
      assert.include(newState.byAppUuid[appUuid], permission2.uuid)
    })

    it('should remove the specified permission uuid from ByAppUuid', () => {
      const newState = reducer(prevState, action)
      assert.notInclude(newState.byAppUuid[appUuid], permission1.uuid)
    })
  })

  describe('when the state only has one permission for the same app present', () => {
    let action
    let permission
    let prevState

    beforeEach(() => {
      permission = createCrossAccountPermission(toAccount, fromAccount, uuidv4())

      prevState = reducer(
        undefined, listPermissionsAction(createListResponse([permission]))
      )
      action = deletePermissionAction(permission)
    })

    it('should remove the permission from entities', () => {
      const newState = reducer(prevState, action)
      assert.notProperty(newState.entities, permission.uuid)
      assert.isEmpty(newState.entities)
    })

    it('should remove the permission uuid reference in ByFromAccountShortname', () => {
      const newState = reducer(prevState, action)
      assert.hasAllKeys(newState.byFromAccountShortname, [fromAccount.shortName])
      assert.notInclude(newState.byFromAccountShortname[fromAccount.shortName], permission.uuid)
    })

    it('should remove the permission uuid reference in ByAppUuid', () => {
      const newState = reducer(prevState, action)
      assert.hasAllKeys(newState.byAppUuid, [permission.AppUuid])
      assert.notInclude(newState.byAppUuid[permission.AppUuid], permission.uuid)
    })
  })

  describe('when the state has no permissions present', () => {
    let action
    let permission

    const initialState = {
      entities: {},
      byFromAccountShortname: {},
      byAppUuid: {},
      pending: {},
      error: {},
    }

    beforeEach(() => {
      permission = createCrossAccountPermission(toAccount, fromAccount, uuidv4())
      action = deletePermissionAction(permission)
    })

    it('should keep entities the same (empty)', () => {
      const newState = reducer(undefined, action)
      assert.deepEqual(newState.entities, initialState.entities)
    })

    it('should keep ByFromAccountShortname the same (empty)', () => {
      const newState = reducer(undefined, action)
      assert.deepEqual(newState.byFromAccountShortname, initialState.byFromAccountShortname)
    })

    it('should keep ByAppUuid the same (empty)', () => {
      const newState = reducer(undefined, action)
      assert.deepEqual(newState.byAppUuid, initialState.byAppUuid)
    })
  })
})
