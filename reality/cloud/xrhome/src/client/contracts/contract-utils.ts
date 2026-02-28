import type {DeepReadonly} from 'ts-essentials'

import type {ILicenseTemplate, ILicenseTier} from './contract-types'
import {MONTHS_PER_YEAR} from '../../shared/time-utils'

type BaseLicenseTemplate = DeepReadonly<
Omit<ILicenseTemplate, 'type'> & {type: 'DEV' | 'CAMPAIGN' | 'DEMO'}
>
type ExtendedLicenseTemplate = DeepReadonly<
Omit<ILicenseTemplate, 'type'> & {type: 'DEV_EXT' | 'CAMPAIGN_EXT'}
>

type BaseLicensePackage = DeepReadonly<{
  type: BaseLicenseTemplate['type']
  invoiceLicense?: never
  subLicense: BaseLicenseTemplate
  tiers: ILicenseTier[]
  packageId: string
  name: string
  description: string
}>

type ExtendedLicensePackage = DeepReadonly<
Omit<BaseLicensePackage, 'subLicense' | 'invoiceLicense'> & {
  invoiceLicense: BaseLicenseTemplate
  subLicense: ExtendedLicenseTemplate
}>

type ILicensePackage = BaseLicensePackage | ExtendedLicensePackage
type LicenseTemplate = BaseLicenseTemplate | ExtendedLicenseTemplate

type Package = {
  ext: ExtendedLicenseTemplate
  nonExt: BaseLicenseTemplate
}

const isExtended = (
  license: DeepReadonly<ILicenseTemplate>
): license is ExtendedLicenseTemplate => (
  license.type.includes('_EXT')
)

const convertLicensesToPackages = (
  licenses: DeepReadonly<LicenseTemplate[]>
): ILicensePackage[] => {
  const packages: Record<string, Package> = {}

  licenses.forEach((license) => {
    const p = packages[license.packageId]
    if (isExtended(license)) {
      packages[license.packageId] = {...p, ext: license}
    } else {
      packages[license.packageId] = {...p, nonExt: license}
    }
  })

  return Object.values(packages).map((p): ILicensePackage => {
    if (p.ext) {
      return {
        invoiceLicense: p.nonExt,
        subLicense: p.ext,
        type: p.nonExt.type,
        tiers: p.ext.ContractTiers,
        packageId: p.nonExt.packageId,
        name: p.nonExt.name,
        description: p.nonExt.description,
      }
    }
    return {
      subLicense: p.nonExt,
      type: p.nonExt.type,
      tiers: p.nonExt.ContractTiers,
      packageId: p.nonExt.packageId,
      name: p.nonExt.name,
      description: p.nonExt.description,
    }
  })
}

const calculateSavingsBetweenLicenses = (
  baseLicense: ILicensePackage,
  newLicense: ILicensePackage
) => {
  // Currently do not support calculating savings if the package has a minimum commitment
  if (baseLicense.invoiceLicense || newLicense.invoiceLicense) {
    return 0
  }

  // Currently do not support calculating savings for day or week intervals.
  const supportedIntervals = ['MONTH', 'YEAR']
  if (!supportedIntervals.includes(baseLicense.subLicense.interval) ||
    !supportedIntervals.includes(newLicense.subLicense.interval)) {
    return 0
  }

  const {subLicense: baseSubLicense} = baseLicense
  const {subLicense: newSubLicense} = newLicense
  const intervalConversion = baseSubLicense.interval === newSubLicense.interval
    ? (baseSubLicense.intervalCount / newSubLicense.intervalCount)
    : (baseSubLicense.intervalCount / (newSubLicense.intervalCount * MONTHS_PER_YEAR))

  const newPriceOverDefaultInterval = newSubLicense.amount * intervalConversion
  const totalSavings = baseSubLicense.amount - newPriceOverDefaultInterval
  if (totalSavings <= 0) {
    return 0
  }

  return totalSavings
}

export type {ILicensePackage}

export {convertLicensesToPackages, isExtended, calculateSavingsBetweenLicenses}
