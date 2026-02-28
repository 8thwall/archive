import type {IContract} from '../common/types/models'

type ContractTemplateType = 'CAMPAIGN' | 'DEV' | 'CAMPAIGN_EXT' | 'DEV_EXT' | 'DEMO'

/* eslint-disable camelcase */
interface ILicenseTier {
  ContractTemplateUuid: string
  flat_amount: number
  unit_amount: number
  up_to: number
  uuid: string
}
/* eslint-enable camelcase */

interface ILicenseTemplate {
  name?: string
  description?: string
  uuid: string
  type: ContractTemplateType
  amount: number
  interval: string
  intervalCount: number
  ContractUuid: string
  packageId: string
  ContractTiers?: ILicenseTier[]
}

interface ContractReduxState {
  allContracts: IContract[]
  availableContracts: IContract[]
  userLicenses: ILicenseTemplate[]
  pending: boolean
}

export type {
  ContractReduxState,
  ILicenseTier,
  ILicenseTemplate,
}
