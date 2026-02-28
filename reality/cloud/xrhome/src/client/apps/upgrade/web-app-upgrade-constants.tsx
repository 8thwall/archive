import icons from '../icons'

// TODO(kim): Modify to separate lists for upgrade/downgrade
// No more comparisons for upgrade
const PLAN_FEATURES = [
  {
    label: 'plan_billing_page.plan_features.unlimited_seats',
    upgradePlans: ['WebAgency'],
    downGradePlans: ['WebAgency', 'WebEnterprise'],
    upgradeImg: icons.upgradeSeatsColor,
    downgradeImg: icons.upgradeSeatsGrey,
  },
  {
    label: 'plan_billing_page.plan_features.three_seats',
    upgradePlans: ['WebStarter'],
    downGradePlans: [],
    upgradeImg: icons.upgradeSeatsColor,
    downgradeImg: icons.upgradeSeatsGrey,
  },
  {
    label: 'plan_billing_page.plan_features.six_seats',
    upgradePlans: ['WebPlus'],
    downGradePlans: ['WebPlus'],
    upgradeImg: icons.upgradeSeatsColor,
    downgradeImg: icons.upgradeSeatsGrey,
  },
  {
    label: 'plan_billing_page.plan_features.commercial_license',
    upgradePlans: ['WebAgency'],
    downGradePlans: ['WebAgency'],
    upgradeImg: icons.upgradeLicenseColor,
    downgradeImg: icons.upgradeLicenseGrey,
  },
  {
    label: 'plan_billing_page.plan_features.publish_to',
    upgradePlans: ['WebStarter'],
    downGradePlans: [],
    upgradeImg: icons.upgradePublishColor,
    downgradeImg: icons.upgradePublishGrey,
  },
  {
    label: 'plan_billing_page.plan_features.local_dev',
    upgradePlans: ['WebAgency'],
    downGradePlans: ['WebAgency'],
    upgradeImg: icons.upgradeLocalDevColor,
    downgradeImg: icons.upgradeLocalDevGrey,
  },
  {
    label: 'plan_billing_page.plan_features.app_key',
    upgradePlans: ['WebAgency', 'WebEnterprise'],
    downGradePlans: ['WebAgency', 'WebEnterprise'],
    upgradeImg: icons.upgradeHostColor,
    downgradeImg: icons.upgradeHostGrey,
  },
  {
    label: 'plan_billing_page.plan_features.remove_splash_screen',
    upgradePlans: ['WebAgency'],
    downGradePlans: [],
    upgradeImg: icons.upgradeSplashScreenColor,
    downgradeImg: icons.upgradeSplashScreenGrey,
  },
  {
    label: 'plan_billing_page.plan_features.connected_domains',
    upgradePlans: ['WebPlus'],
    downGradePlans: ['WebPlus', 'WebAgency'],
    upgradeImg: icons.upgradeDomainColor,
    downgradeImg: icons.upgradeDomaintGrey,
  },
  {
    label: 'plan_billing_page.plan_features.direct_urls',
    upgradePlans: ['WebPlus'],
    downGradePlans: ['WebPlus', 'WebAgency'],
    upgradeImg: icons.upgradeDirectUrlColor,
    downgradeImg: icons.upgradeDirectUrlGrey,
  },
  {
    label: 'plan_billing_page.plan_features.embeddable_ar',
    upgradePlans: ['WebPlus'],
    downGradePlans: ['WebPlus'],
    upgradeImg: icons.upgradeEmbedAdsColor,
    downgradeImg: icons.upgradeEmbedAdsGrey,
  },
  {
    label: 'plan_billing_page.plan_features.pwas',
    upgradePlans: ['WebPlus'],
    downGradePlans: ['WebPlus'],
    upgradeImg: icons.upgradePwasColor,
    downgradeImg: icons.upgradePwasGrey,
  },
  {
    label: 'plan_billing_page.plan_features.public_profile',
    upgradePlans: ['WebStarter'],
    downGradePlans: ['WebStarter', 'WebPlus'],
    upgradeImg: icons.upgradePublicProfileColor,
    downgradeImg: icons.upgradePublicProfileGrey,
  },
  {
    label: 'plan_billing_page.plan_features.discovery_hub',
    upgradePlans: [],
    downGradePlans: ['WebAgency'],
    hideOnDowngrade: [],
    upgradeImg: icons.upgradeDiscoverColor,
    downgradeImg: icons.upgradeDiscoverGrey,
  },
  {
    label: 'plan_billing_page.plan_features.payments',
    upgradePlans: ['WebStarter'],
    downGradePlans: [],
    upgradeImg: icons.upgradePaymentsColor,
    downgradeImg: icons.upgradePaymentsGrey,
  },
  {
    label: 'plan_billing_page.plan_features.private_profiles',
    upgradePlans: [],
    downGradePlans: ['WebAgency'],
    upgradeImg: icons.upgradePublicProfileColor,
    downgradeImg: icons.upgradePublicProfileGrey,
  },
]

const DOWNGRADE_MESSAGES = [
  {
    text: 'plan_billing_page.plan_features.profile_now_live',
    qualifiedPlans: ['WebStarter', 'WebPlus'],
  },
  {
    text: 'plan_billing_page.plan_features.all_apps_published',
    qualifiedPlans: ['WebPlus'],
  },
  {
    text: 'plan_billing_page.plan_features.all_apps_accessed',
    qualifiedPlans: ['WebStarter'],
  },
  {
    text: 'plan_billing_page.plan_features.all_projects_need_republish',
    qualifiedPlans: ['WebStarter', 'WebPlus'],
  },
]

enum LostFeaturesOnDowngrade {
  CLOUD_EDITOR,
  CONNECTED_DOMAINS,
  SELF_HOSTING,
  LOCAL_DEVELOPMENT,
  COMMERCIAL_LICENSE,
  PRIVATE_PROFILES,
}

const CONFIRM_DOWNGRADE_ACCOUNT_MESSAGES = {
  'WebStarter': {
    downgradeHeading: 'plan_billing_page.cancel_plan_confirm.heading_starter',
    downgradeWarning: 'plan_billing_page.cancel_plan_confirm.warning_starter',
    downgradeToBasic: 'plan_billing_page.cancel_plan_confirm.starter_sub_end_date_to_basic',
    noAccessMsg: 'plan_billing_page.cancel_plan_confirm.starter_no_access',
    lostFeaturesMsg: 'plan_billing_page.cancel_plan_confirm.starter_lost_features',
    lostFeaturesOnDowngrade: [],
  },
  'WebPlus': {
    downgradeHeading: 'plan_billing_page.cancel_plan_confirm.heading_plus',
    downgradeWarning: 'plan_billing_page.cancel_plan_confirm.warning_plus',
    downgradeToBasic: 'plan_billing_page.cancel_plan_confirm.plus_sub_end_date_to_basic',
    noAccessMsg: 'plan_billing_page.cancel_plan_confirm.plus_no_access',
    lostFeaturesMsg: 'plan_billing_page.cancel_plan_confirm.plus_lost_features',
    lostFeaturesOnDowngrade: [
      LostFeaturesOnDowngrade.CONNECTED_DOMAINS,
    ],
  },
  'WebAgency': {
    downgradeHeading: 'plan_billing_page.cancel_plan_confirm.heading_pro',
    downgradeWarning: 'plan_billing_page.cancel_plan_confirm.warning_pro',
    downgradeToBasic: 'plan_billing_page.cancel_plan_confirm.pro_sub_end_date_to_basic',
    noAccessMsg: 'plan_billing_page.cancel_plan_confirm.pro_no_access',
    lostFeaturesMsg: 'plan_billing_page.cancel_plan_confirm.pro_lost_features',
    lostFeaturesOnDowngrade: [
      LostFeaturesOnDowngrade.CONNECTED_DOMAINS,
      LostFeaturesOnDowngrade.SELF_HOSTING,
      LostFeaturesOnDowngrade.LOCAL_DEVELOPMENT,
      LostFeaturesOnDowngrade.PRIVATE_PROFILES,
    ],
  },
}

export {
  PLAN_FEATURES,
  DOWNGRADE_MESSAGES,
  CONFIRM_DOWNGRADE_ACCOUNT_MESSAGES,
  LostFeaturesOnDowngrade,
}
