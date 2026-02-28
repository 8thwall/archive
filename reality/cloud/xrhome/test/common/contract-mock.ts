import {v4 as uuidv4} from 'uuid'

import {MILLISECONDS_PER_MINUTE} from '../../src/shared/time-utils'

import db from '../../storage/schema'
import {stripe} from '../stripe/mock-stripe'

const createContractTemplates = async (ContractUuid) => {
  const price = await stripe.prices.create({
    currency: 'usd',
    unit_amount: 25000,
    product_data: {
      name: 'Fake Dev License',
    },
    recurring: {
      interval: 'month',
      interval_count: 1,
    },
  })
  const price2 = await stripe.prices.create({
    currency: 'usd',
    unit_amount: 25000,
    product_data: {
      name: 'Fake Campain License',
    },
    recurring: {
      interval: 'month',
      interval_count: 1,
    },
  })
  const devContracTemplate = await db.ContractTemplate.create({
    uuid: uuidv4(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ContractUuid,
    amount: '25000',
    interval: 'MONTH',
    intervalCount: 1,
    daysUntilDue: 30,
    stripeSubPlanId: price.id,
    type: 'DEV',
  })

  const launchContractTemplate = await db.ContractTemplate.create({
    uuid: uuidv4(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ContractUuid,
    amount: '25000',
    interval: 'MONTH',
    intervalCount: 1,
    daysUntilDue: 30,
    stripeSubPlanId: price2.id,
    type: 'CAMPAIGN',
  })

  return [devContracTemplate, launchContractTemplate]
}

const createContract = async (fields = {}) => {
  const contractUuid = uuidv4()
  const contract = await db.Contract.create({
    uuid: contractUuid,
    name: 'noAccountUuid',
    createdBy: 5,
    expirationDate: new Date(Date.now() + 1000 * 60 * 10),
    startDate: new Date(Date.now() + 1000 * 60 * 9),
    signedDate: new Date(Date.now() + 1000 * 60 * 6),
    hasPublicityRights: true,
    ...fields,
  })
  const [devContract, launchContract] = await createContractTemplates(contractUuid)
  return [contract, devContract, launchContract]
}

const createDefaultContract = async (fields = {}) => createContract({
  ...fields,
  isAvailableAsCanned: true,
  isReusable: true,
})

const createFixedPaymentContract = async (accountUuid = null, isRecurring = false) => {
  const contractUuid = uuidv4()
  const packageId = uuidv4()

  const price = await stripe.prices.create({
    currency: 'usd',
    unit_amount: 300000,
    product_data: {
      name: 'Fake Campaign License',
    },
    recurring: {
      interval: 'month',
      interval_count: 1,
    },
  })
  const price2 = await stripe.prices.create({
    currency: 'usd',
    unit_amount: 100000,
    product_data: {
      name: 'Fake Campaign Ext License',
    },
    recurring: {
      interval: 'month',
      interval_count: 1,
    },
  })

  const contract = await db.Contract.create({
    uuid: contractUuid,
    name: 'Fixed Payment Contract',
    AccountUuid: accountUuid,
    createdBy: 5,
    expirationDate: new Date(Date.now() + MILLISECONDS_PER_MINUTE * 10),
    startDate: new Date(Date.now() + MILLISECONDS_PER_MINUTE * 9),
    signedDate: new Date(Date.now() + MILLISECONDS_PER_MINUTE * 6),
    hasPublicityRights: true,
    isAvailableAsCanned: false,
    isReusable: false,
    isRecurringContract: isRecurring,
  })
  const fixedPaymentContracTemplate = await db.ContractTemplate.create({
    uuid: uuidv4(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ContractUuid: contractUuid,
    amount: 300000,
    interval: 'MONTH',
    intervalCount: 3,
    daysUntilDue: 30,
    stripeSubPlanId: price.id,
    type: 'CAMPAIGN',
    packageId,
  })
  const extensionContractTemplate = await db.ContractTemplate.create({
    uuid: uuidv4(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ContractUuid: contractUuid,
    amount: 100000,
    interval: 'MONTH',
    intervalCount: 1,
    daysUntilDue: 30,
    stripeSubPlanId: price2.id,
    type: 'CAMPAIGN_EXT',
    packageId,
  })
  return [contract, fixedPaymentContracTemplate, extensionContractTemplate]
}

export {
  createContract,
  createDefaultContract,
  createContractTemplates,
  createFixedPaymentContract,
}
