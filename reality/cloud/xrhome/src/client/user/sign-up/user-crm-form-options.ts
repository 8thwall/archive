import {TFunction, useTranslation} from 'react-i18next'

const BEST_DESCRIBED_ROLE_OPTIONS = {
  artist: {
    translationValueKey: 'crm_form.role_options.artist',
    value: 'Artist',
  },
  designer: {
    translationValueKey: 'crm_form.role_options.designer',
    value: 'Designer',
  },
  developer: {
    translationValueKey: 'crm_form.role_options.developer',
    value: 'Developer',
  },
  educator: {
    translationValueKey: 'crm_form.role_options.educator',
    value: 'Educator',
  },
  manager: {
    translationValueKey: 'crm_form.role_options.manager',
    value: 'Manager',
  },
  marketer: {
    translationValueKey: 'crm_form.role_options.marketer',
    value: 'Marketer',
  },
  other: {
    translationValueKey: 'crm_form.role_options.other',
    value: 'Other',
  },
  productManager: {
    translationValueKey: 'crm_form.role_options.product_manager',
    value: 'Manager',
  },
  sales: {
    translationValueKey: 'crm_form.role_options.sales',
    value: 'Sales',
  },
  student: {
    translationValueKey: 'crm_form.role_options.student',
    value: 'Student',
  },
} as const

const INDUSTRY_OPTIONS = {
  education: {
    translationValueKey: 'crm_form.industry_options.education',
    value: 'Education',
  },
  entertainment: {
    translationValueKey: 'crm_form.industry_options.entertainment',
    value: 'Entertainment',
  },
  financialServices: {
    translationValueKey: 'crm_form.industry_options.financial_services',
    value: 'Financial Services',
  },
  healthcare: {
    translationValueKey: 'crm_form.industry_options.healthcare',
    value: 'Healthcare',
  },
  hotelFoodServices: {
    translationValueKey: 'crm_form.industry_options.hotel_food_services',
    value: 'Hotel & Food Services',
  },
  manufacturing: {
    translationValueKey: 'crm_form.industry_options.manufacturing',
    value: 'Manufacturing',
  },
  marketingAdvertising: {
    translationValueKey: 'crm_form.industry_options.marketing_advertising',
    value: 'Marketing & Advertising',
  },
  oilGas: {
    translationValueKey: 'crm_form.industry_options.oil_gas',
    value: 'Oil & Gas',
  },
  other: {
    translationValueKey: 'crm_form.industry_options.other',
    value: 'Other',
  },
  publishing: {
    translationValueKey: 'crm_form.industry_options.publishing',
    value: 'Publishing',
  },
  retail: {
    translationValueKey: 'crm_form.industry_options.retail',
    value: 'Retail',
  },
  software: {
    translationValueKey: 'crm_form.industry_options.software',
    value: 'Software',
  },
  sports: {
    translationValueKey: 'crm_form.industry_options.sports',
    value: 'Sports',
  },
  telecommunications: {
    translationValueKey: 'crm_form.industry_options.telecommunications',
    value: 'Telecommunications',
  },
  travelTourism: {
    translationValueKey: 'crm_form.industry_options.travel_tourism',
    value: 'Travel & Tourism',
  },
} as const

type RoleOptions = typeof BEST_DESCRIBED_ROLE_OPTIONS
type IndustryOptions = typeof INDUSTRY_OPTIONS
type OptionKeys = keyof typeof BEST_DESCRIBED_ROLE_OPTIONS | keyof typeof INDUSTRY_OPTIONS

type CrmFormOption = {
  key: OptionKeys
  value: string
  text: string
}

type GetFormOptionsFunction = (
  options: RoleOptions | IndustryOptions, t: TFunction<'complete-signup'[]>
) => CrmFormOption[]

type UseCrmFormOptions = () => ({
  bestDescribedRoleDropdownOptions: CrmFormOption[]
  industryDropdownOptions: CrmFormOption[]
})

const getFormOptions: GetFormOptionsFunction = (
  options, t
) => (
  Object.entries(options).map(
    ([k, v]) => <CrmFormOption>({key: k, value: v.value, text: t(v.translationValueKey)})
  )
)

const useCrmFormOptions: UseCrmFormOptions = () => {
  const {t} = useTranslation(['complete-signup'])
  return {
    bestDescribedRoleDropdownOptions: getFormOptions(BEST_DESCRIBED_ROLE_OPTIONS, t),
    industryDropdownOptions: getFormOptions(INDUSTRY_OPTIONS, t),
  }
}

export {
  useCrmFormOptions,
}
