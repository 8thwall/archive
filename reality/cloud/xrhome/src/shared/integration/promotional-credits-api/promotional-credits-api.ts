import type AWS from 'aws-sdk'

import {entry} from '../../registry'

type PublishOrigins = 'xrhome' | 'admin-console'

type CreateGrantsParams = {
  AccountUuids: string[]
  creditAmount: number
  effectiveDateMs?: number
  expiryDateMs?: number
  origin?: PublishOrigins
  description?: string
}

interface IPromotionalCreditsApi {
  createGrants: (params: CreateGrantsParams) => Promise<AWS.Lambda.InvocationResponse>
}

const PromotionalCreditsApi = entry<IPromotionalCreditsApi>('promotional-credits-api')

export {PromotionalCreditsApi}

export type {
  IPromotionalCreditsApi,
  PublishOrigins,
  CreateGrantsParams,
}
