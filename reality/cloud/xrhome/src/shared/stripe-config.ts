type AccountPlan = 'WebAgency' | 'WebBusiness' | 'WebCameraPro' | 'WebDeveloperPro' |
  'WebPlus' | 'WebStarter'
interface AccountPlanPrices {
  subscription: string
  usage?: string
  additionalDevLicenses?: string
}
interface StripeKeys {
  Publishable: string
  plans: Record<AccountPlan, AccountPlanPrices>
  products: Record<AccountPlan, Set<string>>
}
const testKeys: StripeKeys = {
  Publishable: 'pk_test_<REMOVED_BEFORE_OPEN_SOURCING>',
  plans: {
    WebCameraPro: {
      usage: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
      subscription: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
    },
    WebDeveloperPro: {
      usage: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
      subscription: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
    },
    WebStarter: {
      subscription: 'price_<REMOVED_BEFORE_OPEN_SOURCING>',
    },
    WebPlus: {
      subscription: 'price_<REMOVED_BEFORE_OPEN_SOURCING>',
    },
    WebAgency: {
      subscription: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
    },
    WebBusiness: {
      subscription: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
      additionalDevLicenses: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
    },
  },
  products: {
    WebAgency: new Set(['prod_<REMOVED_BEFORE_OPEN_SOURCING>']),
    WebBusiness: new Set(['prod_<REMOVED_BEFORE_OPEN_SOURCING>']),
    WebCameraPro: new Set(['prod_<REMOVED_BEFORE_OPEN_SOURCING>']),
    WebDeveloperPro: new Set(['prod_<REMOVED_BEFORE_OPEN_SOURCING>']),
    WebPlus: new Set(['prod_<REMOVED_BEFORE_OPEN_SOURCING>']),
    WebStarter: new Set(['prod_<REMOVED_BEFORE_OPEN_SOURCING>']),
  },
}

const prodKeys: StripeKeys = {
  Publishable: 'pk_live_<REMOVED_BEFORE_OPEN_SOURCING>',
  plans: {
    WebCameraPro: {
      usage: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
      subscription: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
    },
    WebDeveloperPro: {
      usage: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
      subscription: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
    },
    WebStarter: {
      subscription: 'price_<REMOVED_BEFORE_OPEN_SOURCING>',
    },
    WebPlus: {
      subscription: 'price_<REMOVED_BEFORE_OPEN_SOURCING>',
    },
    WebAgency: {
      subscription: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
    },
    WebBusiness: {
      subscription: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
      additionalDevLicenses: 'plan_<REMOVED_BEFORE_OPEN_SOURCING>',
    },
  },
  products: {
    WebAgency: new Set([
      'prod_<REMOVED_BEFORE_OPEN_SOURCING>',  // Pro Plan
      'prod_<REMOVED_BEFORE_OPEN_SOURCING>',  // Legacy Annual Pro Plan
    ]),
    WebBusiness: new Set([
      'prod_<REMOVED_BEFORE_OPEN_SOURCING>',  // Legacy Web Business Plan
      'prod_<REMOVED_BEFORE_OPEN_SOURCING>',  // Legacy Web Business Annual Plan
      'prod_<REMOVED_BEFORE_OPEN_SOURCING>',  // Legacy Web Business 6-month Plan
    ]),
    // TODO(alvinportillo): Remove all WebCameraPro and WebDeveloperPro references.
    // We have no more customers subscribed to these products.
    WebCameraPro: new Set([]),
    WebDeveloperPro: new Set([]),
    WebPlus: new Set([
      'prod_<REMOVED_BEFORE_OPEN_SOURCING>',  // Plus Plan
      'prod_<REMOVED_BEFORE_OPEN_SOURCING>',  // Legacy Annual Plus Plan
    ]),
    WebStarter: new Set([
      'prod_<REMOVED_BEFORE_OPEN_SOURCING>',  // Starter Plan
      'prod_<REMOVED_BEFORE_OPEN_SOURCING>',  // Legacy Annual Starter Plan
    ]),
  },
}

const getPlans = (liveMode: boolean) => (liveMode ? prodKeys.plans : testKeys.plans)
const getProducts = (liveMode: boolean) => (liveMode ? prodKeys.products : testKeys.products)

// Stripes usage units are increments of 100 views
const VIEWS_PER_UNIT = 100

export {
  testKeys,
  prodKeys,
  getPlans,
  getProducts,
  VIEWS_PER_UNIT,
}
