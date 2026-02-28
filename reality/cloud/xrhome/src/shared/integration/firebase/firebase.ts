import type {DecodedIdToken} from 'firebase-admin/lib/auth/token-verifier'
import type FirebaseAdmin from 'firebase-admin'

import type {LightshipDeveloperProfile} from '../../../client/lightship/common/firebase-types'
import {entry} from '../../registry'

type ActionRet = {
  link: string
  name: string
}

interface CreateUserParams {
  // Auth
  name: string
  email: string
  password: string
  emailVerified: boolean

}

interface CreateDevProfileParams {
  uid: string
  name: string
  email: string
  receiveUpdates: boolean
  country: string
  tosVersion: string
}

interface UserAction {
  signin?: boolean
  tosVersion?: string
  artifactDownload?: string
}

type DevProfileUpdate = Record<string,
  FirebaseAdmin.firestore.FieldValue | string | Record<string, number>>

type GetDeveloperProfilesOptions = {
  startAfter?: FirebaseAdmin.firestore.Timestamp
  limit?: number
}

interface IFirebase {
  validate: (token: string) => Promise<DecodedIdToken>
  getAccountIdByEmail: (email: string) => Promise<string>
  createAccount: (params: CreateUserParams) => Promise<string>
  deleteAccount: (uid: string) => Promise<void>
  updateAccountEmail: (uid: string, email: string) => Promise<void>
  createDevProfile: (params: CreateDevProfileParams) => Promise<void>
  updateDevProfile: (uid: string, updates: DevProfileUpdate) => Promise<void>
  logAction: (uid: string, action: UserAction) => Promise<void>
  deleteDevProfile: (uid: string) => Promise<void>
  getDeveloperProfile: (uid: string) => Promise<LightshipDeveloperProfile | undefined>
  getDeveloperProfilesByIds: (uids: string[]) => Promise<LightshipDeveloperProfile[]>
  generateResetPasswordLink: (email: string) => Promise<ActionRet>
  generateEmailVerificationLink: (email: string) => Promise<ActionRet>
  getDeveloperProfiles: (options: GetDeveloperProfilesOptions) => (
    Promise<FirebaseAdmin.firestore.QuerySnapshot>
  )
}

const Firebase = entry<IFirebase>('firebase')

export {Firebase}
export type {IFirebase, ActionRet, UserAction, DevProfileUpdate}
