import type {IApp} from '../client/common/types/models'
import type {IRepo} from '../client/git/g8-dto'
import type {App, Account} from './integration/db/models'

/* eslint-disable import/group-exports */

declare global {
  namespace Express {
    export interface Request {
      xrApp?: App | IApp
      _repo?: IRepo
      serverInfo?: {dotAppServer?: boolean, isAppsServer: boolean}
      account?: Account
      appAccount?: App

      // Set by middleware/auth.ts
      /** @deprecated use res.locals.userUuid if 8th Wall only,
        * or res.locals.auth to support lightship login.
        */
      user?: string
      tokenExpired?: boolean

      // Set by middleware/hubspot.ts
      contact?: any
      // TODO(christoph): This might never be set
      hubspot?: {vid: number}
      isTrial?: boolean
    }

    namespace Multer {
      export interface File {
        key?: string
        etag?: string
      }
    }
  }
}
