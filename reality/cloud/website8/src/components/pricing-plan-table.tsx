import React from 'react'

import PricingPlanCard from './pricing-plan-card'
import * as classes from './pricing-plan-table.module.scss'
import useGetPlanInformation from '../hooks/use-get-plan-information'

interface IPricingPlanTable {
  showAnnualPricing: boolean
  showMarketingPlans: boolean
}

const generatePlanCards = (plans) => plans.map((plan) => (
  <PricingPlanCard
    key={plan.title}
    name={plan.title}
    description={plan.description}
    price={plan.price}
    isAnnuallyBilled={plan.isAnnuallyBilled}
    discount={plan.discount}
    accentColor={plan.planCardColor}
    needToContact={plan.mustContact}
    featureList={plan.features}
    contactLink={plan.contactLink}
  />
))

const PricingPlanTable: React.FC<IPricingPlanTable> = ({showAnnualPricing, showMarketingPlans}) => {
  const {
    annualMarketingPlans,
    annualGamingPlans,
    monthlyMarketingPlans,
    monthlyGamingPlans,
  } = useGetPlanInformation()

  let showPlans
  if (showAnnualPricing && showMarketingPlans) {
    showPlans = generatePlanCards(annualMarketingPlans)
  } else if (showAnnualPricing && !showMarketingPlans) {
    showPlans = generatePlanCards(annualGamingPlans)
  } else if (!showAnnualPricing && showMarketingPlans) {
    showPlans = generatePlanCards(monthlyMarketingPlans)
  } else if (!showAnnualPricing && !showMarketingPlans) {
    showPlans = generatePlanCards(monthlyGamingPlans)
  } else {
    showPlans = <div>New Pricing Page</div>
  }

  return (
    <div className={classes.plansTable}>
      {showPlans}
    </div>
  )
}

export default PricingPlanTable
