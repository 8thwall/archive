import {useTranslation} from 'react-i18next'

import {gray2, blueberry, brandBlack} from '../styles/brand-colors'

const useGetPlanInformation = () => {
  const {t} = useTranslation(['pricing-page'])

  const vpsLinkout = {
    key: 'pricing_plan_table.pro.marketing.feature.vps_gsb',
    link: 'https://8th.io/vps-pricing',
  }

  const basicMarketingPlan = {
    title: t('pricing_plan_table.basic.title'),
    description: t('pricing_plan_table.basic.marketing.description'),
    price: t('pricing_plan_table.basic.price'),
    planCardColor: gray2,
    discount: null,
    mustContact: false,
    features: [
      t('pricing_plan_table.basic.marketing.feature.studio'),
      vpsLinkout,
      t('pricing_feature_table.backend_services'),
      t('pricing_feature_table.templates'),
      t('pricing_feature_table.cloud_hosting'),
      t('pricing_plan_table.basic.marketing.feature.public_profile'),
      t('pricing_plan_table.pro.marketing.feature.project_sharing'),
      t('pricing_plan_table.basic.marketing.feature.require_splash_screen'),
      t('pricing_feature_table.forum_support'),
    ],
  }

  const licenseLinkout = {
    key: 'pricing_plan_table.pro.marketing.feature.commercial_license_pricing',
    link: '/pricing#commercial-license',
  }

  const proMarketingPlan = {
    title: t('pricing_plan_table.pro.title'),
    description: t('pricing_plan_table.pro.marketing.description'),
    price: 99,
    isAnnuallyBilled: true,
    planCardColor: blueberry,
    discount: {
      oldPrice: 1548,
      newPrice: 1188,
    },
    mustContact: false,
    features: [
      t('pricing_plan_table.pro.marketing.feature.everything_basic_plus'),
      t('pricing_plan_table.pro.marketing.feature.commercial_licenses'),
      licenseLinkout,
      t('pricing_plan_table.pro.marketing.feature.cloud_editor'),
      t('pricing_plan_table.pro.marketing.feature.self_hosting'),
      t('pricing_plan_table.pro.marketing.feature.connected_domains'),
      t('pricing_plan_table.pro.marketing.feature.agency_profile'),
      t('pricing_plan_table.pro.marketing.feature.private_vps'),
      t('pricing_feature_table.email_support'),
      t('pricing_plan_table.pro.marketing.feature.image_target_management_api'),
    ],
  }

  const basicGamingPlan = {
    ...basicMarketingPlan,
    description: t('pricing_plan_table.pro.gaming.description'),
  }

  const proGamingPlan = {
    title: t('pricing_plan_table.pro.title'),
    description: t('pricing_plan_table.pro.gaming.description'),
    price: t('pricing_Plan_table.pricing.coming_soon'),
    planCardColor: blueberry,
    discount: null,
    mustContact: true,
    features: [
      t('pricing_plan_table.pro.gaming.feature.everything_basic_plus'),
      t('pricing_plan_table.pro.gaming.feature.multiplayer'),
      t('pricing_plan_table.pro.gaming.feature.backend_proxies'),
      t('pricing_plan_table.pro.gaming.feature.metered_storage'),
      t('pricing_plan_table.pro.gaming.feature.remove_splash'),
      t('pricing_feature_table.private_publishing'),
      t('pricing_feature_table.custom_domains'),
      t('pricing_feature_table.email_support'),
      t('pricing_plan_table.pro.gaming.feature.image_target_management_api'),
    ],
    contactLink: '/contact-us-games',
  }

  const customGamingPlan = {
    title: t('pricing_plan_table.custom.title'),
    description: t('pricing_plan_table.custom.gaming.description'),
    price: t('pricing_Plan_table.pricing.coming_soon'),
    planCardColor: brandBlack,
    discount: null,
    mustContact: true,
    features: [
      t('pricing_plan_table.custom.gaming.feature.everything_in_pro_plus'),
      t('pricing_plan_table.custom.gaming.feature.third_party_monetization'),
      t('pricing_plan_table.custom.gaming.feature.discount_ccu'),
      t('pricing_plan_table.custom.gaming.feature.discount_asset_storage'),
      t('pricing_plan_table.custom.gaming.feature.remove_splash_screen'),
      t('pricing_feature_table.private_publishing'),
      t('pricing_feature_table.custom_domains'),
      t('pricing_plan_table.custom.gaming.feature.manage_collaboration'),
      t('pricing_feature_table.tech_support'),
      t('pricing_plan_table.custom.gaming.feature.developer_manager'),
    ],
    contactLink: '/contact-us-games',
  }

  const monthlyMarketingPlan = {
    ...proMarketingPlan,
    price: 129,
    isAnnuallyBilled: false,
    discount: null,
  }

  const annualMarketingPlans = [basicMarketingPlan, proMarketingPlan]
  const annualGamingPlans = [basicGamingPlan, proGamingPlan, customGamingPlan]
  const monthlyMarketingPlans = [basicMarketingPlan, monthlyMarketingPlan]
  const monthlyGamingPlans = [basicGamingPlan, proGamingPlan, customGamingPlan]

  return {
    annualMarketingPlans,
    annualGamingPlans,
    monthlyMarketingPlans,
    monthlyGamingPlans,
  }
}

export default useGetPlanInformation
