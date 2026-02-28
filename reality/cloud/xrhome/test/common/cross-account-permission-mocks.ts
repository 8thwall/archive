import {v4 as uuidv4} from 'uuid'

import type {CrossAccountPermissionStatus} from '../../src/client/common/types/db'
import type {ICrossAccountPermission, IExternalAccount} from '../../src/client/common/types/models'

const createExternalAccount = (shortName: string): IExternalAccount => ({
  uuid: uuidv4(),
  icon: null,
  name: `${shortName} Workspace`,
  accountType: 'WebAgency',
  shortName,
})

const createCrossAccountPermission = (
  toAccount: IExternalAccount,
  fromAccount: IExternalAccount,
  AppUuid: string | null,
  status: CrossAccountPermissionStatus = 'ACTIVE'
): ICrossAccountPermission => ({
  uuid: uuidv4(),
  FromAccountUuid: fromAccount.uuid,
  FromAccount: fromAccount,
  ToAccountUuid: toAccount.uuid,
  ToAccount: toAccount,
  invitedAt: (new Date()).toString(),
  createdAt: (new Date()).toString(),
  updatedAt: (new Date()).toString(),
  status,
  AppUuid,
})

export {
  createExternalAccount,
  createCrossAccountPermission,
}
