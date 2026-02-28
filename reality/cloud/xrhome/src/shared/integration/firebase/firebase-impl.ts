import * as FirebaseAdmin from 'firebase-admin'

import {isNullOrUndefined} from 'util'

import {SecretsProvider} from '../secrets-provider/secrets-provider-api'
import type {IFirebase, UserAction, DevProfileUpdate} from './firebase'
import {firestoreConfig} from '../../../client/lightship/config/firestore-config'
import {LIGHTSHIP_SCOPE} from '../../../server/secret-scopes'
import {makeCodedError} from '../../../server/error'

const {FieldValue, Timestamp} = FirebaseAdmin.firestore

const isInternalEmail = (email: string) => (
  email &&
  // eslint-disable-next-line max-len
  ['@<REMOVED_BEFORE_OPEN_SOURCING>.com', '@<REMOVED_BEFORE_OPEN_SOURCING>.com', '@<REMOVED_BEFORE_OPEN_SOURCING>.com'].some(suffix => email.endsWith(suffix))
)

const createFirebase = (): IFirebase => {
  let appPromise: Promise<FirebaseAdmin.app.App>
  let firestore_
  const initFirebaseApp = async () => {
    const {firebaseServiceKey} = await SecretsProvider.use().getScope(LIGHTSHIP_SCOPE)
    const secret = JSON.parse(firebaseServiceKey)
    const credential: FirebaseAdmin.credential.Credential = FirebaseAdmin.credential.cert(secret)
    return FirebaseAdmin.initializeApp({
      credential,
      projectId: secret.project_id,
    })
  }

  const getApp = async () => {
    appPromise = appPromise || initFirebaseApp()
    return appPromise
  }

  const getFirebaseAuthenticator = async () => {
    const app = await getApp()
    return app.auth()
  }

  const validate = async (token) => {
    const authenticator = await getFirebaseAuthenticator()
    const res = await authenticator.verifyIdToken(token, true)
    if (!res.email_verified) {
      throw makeCodedError('Email not verified', 401)
    }
    return res
  }

  const generateResetPasswordLink = async (email: string) => {
    const auth = await getFirebaseAuthenticator()

    const user = await auth.getUserByEmail(email)
    const link = await auth.generatePasswordResetLink(email)

    return {link, name: user.displayName}
  }

  const getFirestore = async () => {
    if (firestore_) {
      return firestore_
    }
    const app = await getApp()
    return FirebaseAdmin.firestore(app)
  }

  const generateEmailVerificationLink = async (email: string) => {
    const auth = await getFirebaseAuthenticator()

    const user = await auth.getUserByEmail(email)
    const link = await auth.generateEmailVerificationLink(email)

    return {link, name: user.displayName}
  }

  const getAccountIdByEmail = async (email: string) => {
    const auth = await getFirebaseAuthenticator()
    const {uid} = await auth.getUserByEmail(email)

    return uid
  }

  const createAccount = async ({name: displayName, email, emailVerified, password}) => {
    const auth = await getFirebaseAuthenticator()
    const {uid} = await auth.createUser({displayName, email, emailVerified, password})
    return uid
  }

  const deleteAccount = async (uid) => {
    const auth = await getFirebaseAuthenticator()
    await auth.deleteUser(uid)
  }

  const createDevProfile = async ({uid, name, email, receiveUpdates, country, tosVersion}) => {
    const path = firestoreConfig.collections.developerProfile
    const firestore = await getFirestore()
    const collection = firestore.collection(path)
    const data = {
      name,
      email,
      receiveUpdates,
      country,
      downloads: {},
      tos: {
        [tosVersion]: FieldValue.serverTimestamp(),
      },
    }
    const doc = collection.doc(uid)
    Object.assign(data, {
      createTime: FieldValue.serverTimestamp(),
    })

    if (isInternalEmail(data.email)) {
      Object.assign(data, {isInternal: true})
    }

    await doc.create(data)
  }

  const updateDevProfile = async (uid: string, updates: DevProfileUpdate) => {
    const path = firestoreConfig.collections.developerProfile
    const firestore = await getFirestore()
    const collection = firestore.collection(path)

    if (Object.keys(updates).length === 0) {
      return
    }

    if (!isNullOrUndefined(updates.name)) {
      const app = await getApp()
      await app.auth().updateUser(uid, {
        displayName: updates.name.toString(),
      })
    }

    const ref = collection.doc(uid)
    await ref.update(updates)
  }

  const deleteDevProfile = async (id) => {
    const path = firestoreConfig.collections.developerProfile
    const firestore = await getFirestore()
    const doc = firestore.doc(`${path}/${id}`)
    await doc.delete()
  }

  const getDeveloperProfile = async (uid: string) => {
    const path = firestoreConfig.collections.developerProfile
    const firestore = await getFirestore()
    const doc = firestore.doc(`${path}/${uid}`)
    const docSnapshot = await doc.get()

    return docSnapshot?.data()
  }

  const getDeveloperProfilesByIds = async (uids: string[]) => {
    const firestore = await getFirestore()

    const docSnapshots = await firestore.getAll(
      ...uids.map(uid => firestore.doc(`${firestoreConfig.collections.developerProfile}/${uid}`))
    )
    return docSnapshots.map(doc => doc.data())
  }

  const getDeveloperProfiles = async ({
    startAfter, limit: initialLimit,
  }): Promise<FirebaseAdmin.firestore.QuerySnapshot> => {
    const firestore = await getFirestore()
    const limit = initialLimit || 1000
    const q = startAfter !== undefined
      ? firestore.collection(firestoreConfig.collections.developerProfile)
        .orderBy('createTime').startAfter(startAfter).limit(limit)
      : firestore.collection(firestoreConfig.collections.developerProfile)
        .orderBy('createTime').limit(limit)
    return q.get()
  }

  const updateAccountEmail = async (uid: string, email: string) => {
    const app = await getApp()

    await app.auth().updateUser(uid, {
      email,
      emailVerified: false,
    })

    await updateDevProfile(uid, {email})

    await app.auth().revokeRefreshTokens(uid)
  }

  const logAction = async (uid: string, action: UserAction) => {
    const profile = await getDeveloperProfile(uid)
    const updates: DevProfileUpdate = {}

    if (action.artifactDownload) {
      const normalizedArtifact = action?.artifactDownload?.replace(/\./g, '_')
      if (profile.downloads) {
        updates[`downloads.${normalizedArtifact}`] = FieldValue.increment(1)
      } else {
        updates.downloads = {[normalizedArtifact]: 1}
      }
    }

    if (action.signin) {
      updates.signInTimes = FieldValue.arrayUnion(Timestamp.now())
    }

    if (action.tosVersion && !profile.tos[action.tosVersion]) {
      updates[`tos.${action.tosVersion}`] = Timestamp.now()
    }

    await updateDevProfile(uid, updates)
  }

  return {
    validate,
    generateResetPasswordLink,
    getAccountIdByEmail,
    createAccount,
    deleteAccount,
    createDevProfile,
    updateDevProfile,
    deleteDevProfile,
    getDeveloperProfile,
    getDeveloperProfilesByIds,
    generateEmailVerificationLink,
    updateAccountEmail,
    logAction,
    getDeveloperProfiles,
  }
}

export {
  createFirebase,
}
