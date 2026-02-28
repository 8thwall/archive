import {assert} from 'chai'
import {v4 as uuidv4} from 'uuid'

import {
  createCrossAccountPermission, createExternalAccount,
} from './common/cross-account-permission-mocks'
import {createPermissionAction} from '../src/client/cross-account-permissions/action-types'
import {reducer} from '../src/client/cross-account-permissions/reducer'

describe('Cross Account Permissions Reducer - Create Permissions Test', () => {
  let toAccount
  let fromAccount

  beforeEach(() => {
    toAccount = createExternalAccount('alvin')
    fromAccount = createExternalAccount('8w')
  })

  describe('when the state is empty', () => {
    describe('and a permission with an AppUuid is created', () => {
      let action
      let permission

      beforeEach(() => {
        permission = createCrossAccountPermission(toAccount, fromAccount, uuidv4())
        action = createPermissionAction(permission)
      })

      it('should exist in the entities object', () => {
        const newState = reducer(undefined, action)
        assert.equal(Object.keys(newState.entities).length, 1)

        assert.equal(newState.entities[permission.uuid].uuid, permission.uuid)
      })

      it('should exist in the byFromAccountShortname object', () => {
        const newState = reducer(undefined, action)
        assert.equal(Object.keys(newState.byFromAccountShortname).length, 1)

        const permissionsSet = newState.byFromAccountShortname[fromAccount.shortName]
        assert.exists(permissionsSet)
        assert.equal(permissionsSet.length, 1)
        assert.isTrue(permissionsSet.includes(permission.uuid))
      })

      it('should exist in the byAppUuid object', () => {
        const newState = reducer(undefined, action)
        assert.equal(Object.keys(newState.byAppUuid).length, 1)

        const permissionsSet = newState.byAppUuid[permission.AppUuid]
        assert.exists(permissionsSet)
        assert.equal(permissionsSet.length, 1)
        assert.isTrue(permissionsSet.includes(permission.uuid))
      })
    })

    describe('and a permission without an AppUuid is created', () => {
      let action
      let permission

      beforeEach(() => {
        permission = createCrossAccountPermission(toAccount, fromAccount, null)
        action = createPermissionAction(permission)
      })

      it('should exist in the entities object', () => {
        const newState = reducer(undefined, action)
        assert.equal(Object.keys(newState.entities).length, 1)
        assert.equal(newState.entities[permission.uuid].uuid, permission.uuid)
      })

      it('should exist in the byFromAccountShortname object', () => {
        const newState = reducer(undefined, action)
        assert.equal(Object.keys(newState.byFromAccountShortname).length, 1)

        const permissionsSet = newState.byFromAccountShortname[fromAccount.shortName]
        assert.exists(permissionsSet)
        assert.equal(permissionsSet.length, 1)
        assert.isTrue(permissionsSet.includes(permission.uuid))
      })

      it('should NOT exist in the byAppUuid object', () => {
        const newState = reducer(undefined, action)
        assert.equal(0, Object.keys(newState.byAppUuid).length)
      })
    })
  })

  describe('when the state is not empty', () => {
    let previousState
    let previousPermission
    beforeEach(() => {
      previousPermission = createCrossAccountPermission(toAccount, fromAccount, uuidv4())
      previousState = reducer(undefined, createPermissionAction(previousPermission))
    })

    describe('and a permission with an existing FromAccount is created', () => {
      let action
      let permission

      beforeEach(() => {
        const newToAccount = createExternalAccount('ghost')
        permission = createCrossAccountPermission(newToAccount, fromAccount, uuidv4())
        action = createPermissionAction(permission)
      })

      it('should exist as a new field in the entities object', () => {
        const newState = reducer(previousState, action)
        assert.equal(Object.keys(newState.entities).length, 2)
        assert.equal(newState.entities[permission.uuid].uuid, permission.uuid)
      })

      it('should update an existing field in the byFromAccountShortname object', () => {
        const newState = reducer(previousState, action)
        assert.equal(Object.keys(newState.byFromAccountShortname).length, 1)

        const permissionsSet = newState.byFromAccountShortname[fromAccount.shortName]
        assert.exists(permissionsSet)
        assert.equal(permissionsSet.length, 2)
        assert.isTrue(permissionsSet.includes(permission.uuid))
      })
    })

    describe('and a permission with an existing AppUuid is created', () => {
      let action
      let permission

      beforeEach(() => {
        const newToAccount = createExternalAccount('ghost')
        permission = createCrossAccountPermission(
          newToAccount,
          fromAccount,
          previousPermission.AppUuid
        )
        action = createPermissionAction(permission)
      })

      it('should exist as a new field in the entities object', () => {
        const newState = reducer(previousState, action)
        assert.equal(Object.keys(newState.entities).length, 2)
        assert.equal(newState.entities[permission.uuid].uuid, permission.uuid)
      })

      it('should update an existing field in the byAppUuid object', () => {
        const newState = reducer(previousState, action)
        assert.equal(Object.keys(newState.byAppUuid).length, 1)

        const permissionsSet = newState.byAppUuid[permission.AppUuid]
        assert.exists(permissionsSet)
        assert.equal(permissionsSet.length, 2)
        assert.isTrue(permissionsSet.includes(permission.uuid))
      })
    })

    describe('and a permission with a unique FromAccount and AppUuid is created', () => {
      let action
      let permission

      beforeEach(() => {
        const newToAccount = createExternalAccount('ghost')
        const newFromAccount = createExternalAccount('portillo')
        permission = createCrossAccountPermission(newToAccount, newFromAccount, uuidv4())
        action = createPermissionAction(permission)
      })

      it('should exist as a new field in the entities object', () => {
        const newState = reducer(previousState, action)
        assert.equal(Object.keys(newState.entities).length, 2)
        assert.equal(newState.entities[permission.uuid].uuid, permission.uuid)
      })

      it('should exist as a new field in the byFromAccountShortname object', () => {
        const newState = reducer(previousState, action)
        assert.equal(Object.keys(newState.byFromAccountShortname).length, 2)

        const permissionsSet = newState.byFromAccountShortname[permission.FromAccount.shortName]
        assert.exists(permissionsSet)
        assert.equal(permissionsSet.length, 1)
        assert.isTrue(permissionsSet.includes(permission.uuid))
      })

      it('should exist as a new field in the byAppUuid object', () => {
        const newState = reducer(previousState, action)
        assert.equal(Object.keys(newState.byAppUuid).length, 2)

        const permissionsSet = newState.byAppUuid[permission.AppUuid]
        assert.exists(permissionsSet)
        assert.equal(permissionsSet.length, 1)
        assert.isTrue(permissionsSet.includes(permission.uuid))
      })
    })
  })
})
