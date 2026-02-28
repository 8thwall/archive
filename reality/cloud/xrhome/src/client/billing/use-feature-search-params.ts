import type {DeepReadonly} from 'ts-essentials'
import React from 'react'
import {useQuery} from '@tanstack/react-query'

import type {Feature} from '../common/types/db'
import useActions from '../common/use-actions'
import accountActions from '../accounts/account-actions'
import useCurrentAccount from '../common/use-current-account'
import {FeatureCategory} from '../../shared/feature-constants'
import {ACCOUNT_FEATURES} from '../../shared/feature-config'
import {isAccountFeature, isAccountCreditGrantFeature} from '../../shared/feature-utils'

const REFETCH_INTERVAL = 5000  // 5 seconds

const MAX_POLL_COUNT = 5

type FeatureParams = Pick<Feature, 'featureName' | 'optionName'> &{
  entityName: string
  category: FeatureCategory
  quantity?: number
}

const REQUIRED_PARAMS: (keyof FeatureParams)[] = [
  'category', 'featureName', 'optionName', 'entityName',
]

const accountContainsFeature = (
  shortName: string, accountFeatures: DeepReadonly<Feature[]>, params: FeatureParams
) => {
  const {category, featureName, optionName, entityName} = params
  return accountFeatures.some(f => (
    f.category.toLowerCase() === category.toLowerCase() &&
    f.featureName.toLowerCase() === featureName.toLowerCase() &&
    f.optionName.toLowerCase() === optionName.toLowerCase() &&
    shortName.toLowerCase() === entityName.toLowerCase()))
}

const createQueryParams = (params: FeatureParams) => {
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.set(key, value.toString())
    }
  })
  return queryParams.toString()
}

const createSuccessUrl = (baseUrl: string, params: FeatureParams) => (
  `${baseUrl}?${createQueryParams(params)}`
)

const isValidParams = (
  params: Record<string, string | number>
): params is FeatureParams => REQUIRED_PARAMS.every(key => !!params[key])

const useFeatureSearchParams = () => {
  const account = useCurrentAccount()
  const {getAccounts} = useActions(accountActions)
  const [featureSearchParams, setFeatureSearchParams] = React.useState<FeatureParams>(null)
  const [isAccountFeaturesLoading, setIsAccountFeaturesLoading] = React.useState(false)
  const [
    isAccountCreditGrantTopUpPurchased, setIsAccountCreditGrantTopUpPurchased,
  ] = React.useState(false)
  const pollCounterRef = React.useRef<number>(0)
  const {CreditGrant: CreditGrantFeature} = ACCOUNT_FEATURES

  useQuery({
    queryKey: ['featureSearchParams', featureSearchParams],
    queryFn: async () => {
      if (featureSearchParams) {
        await getAccounts()
        pollCounterRef.current += 1
        if (pollCounterRef.current > MAX_POLL_COUNT) {
          setIsAccountFeaturesLoading(false)
          setFeatureSearchParams(null)
        }
      }

      return null
    },
    refetchInterval: REFETCH_INTERVAL,
    staleTime: Infinity,
    enabled: isAccountFeaturesLoading && pollCounterRef.current <= MAX_POLL_COUNT,
  })

  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.size === 0) {
      return
    }
    const obj: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      obj[key] = value
    })
    if (!featureSearchParams && isValidParams(obj)) {
      setFeatureSearchParams(obj)
      const {category, featureName, optionName} = obj

      // Account Features
      if (category === FeatureCategory.Account && isAccountFeature(featureName, optionName)) {
        // Account Feature check
        const featureOption = ACCOUNT_FEATURES[featureName]?.[optionName]
        if (featureOption && !featureOption.isTopUp &&
          !accountContainsFeature(account.shortName, account.Features, obj)
        ) {
          pollCounterRef.current = 0
          setIsAccountFeaturesLoading(true)
        }

        // Credit Grant Top-Up
        if (isAccountCreditGrantFeature(featureName, optionName) &&
          CreditGrantFeature[optionName]?.isTopUp) {
          setIsAccountCreditGrantTopUpPurchased(true)
        }
      }

      // NOTE(johnny): Clear search params from the URL
      if (window.location.search) {
        const newUrl = window.location.pathname + window.location.hash
        window.history.replaceState({}, '', newUrl)
      }
    }
  }, [window.location.search])

  // Account Feature check
  React.useEffect(() => {
    if (featureSearchParams) {
      const {category, featureName, optionName} = featureSearchParams
      if (category === FeatureCategory.Account && isAccountFeature(featureName, optionName) &&
        account.Features &&
        accountContainsFeature(account.shortName, account.Features, featureSearchParams)) {
        setIsAccountFeaturesLoading(false)
        setFeatureSearchParams(null)
      }
    }
  }, [account.shortName, account.Features, featureSearchParams])

  // TODO(wayne): Find a more structured way to handle different feature params
  return {
    featureSearchParams,
    isAccountFeaturesLoading,
    isAccountCreditGrantTopUpPurchased,
  }
}

export {
  createSuccessUrl,
  useFeatureSearchParams,
}

export type {
  FeatureParams,
}
