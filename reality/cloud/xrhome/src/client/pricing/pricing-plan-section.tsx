import * as React from 'react'
import {Trans, useTranslation} from 'react-i18next'

import {createThemedStyles} from '../ui/theme'
import {PricingPageSection} from './pricing-page-section'
import {PricingPlanCard} from './pricing-plan-card'
import {mobileViewOverride, smallMonitorViewOverride} from '../static/styles/settings'
import {CREDIT_GRANT_FEATURE} from '../../shared/feature-config'
import {PricingPlanPrice} from './pricing-plan-price'
import {PricingCreditAmount} from './pricing-credit-amount'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import AutoHeading from '../widgets/auto-heading'
import {combine} from '../common/styles'
import {SpaceBetween} from '../ui/layout/space-between'
import {Badge} from '../ui/components/badge'
import {formatToCurrency} from '../../shared/billing/currency-formatter'
import {Icon} from '../ui/components/icon'
import {StandardLink} from '../ui/components/standard-link'
import {PricingGradientBackground} from './pricing-gradient-background'

const useStyles = createThemedStyles(theme => ({
  pricingPageSection: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: '2em',
    padding: '0 4rem',
    [mobileViewOverride]: {
      flexDirection: 'column',
      gap: '1.5em',
    },
  },

  freePlanDetailTable: {
    'alignSelf': 'end',
    'borderCollapse': 'collapse',
    'width': '100%',
    '& td': {
      border: '0px solid transparent',
    },
    '& tr > td + td': {
      borderLeftWidth: '1.5em',
    },
  },
  freePlanDetail: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    maxWidth: '526px',
    height: '100%',
    gap: '2rem',
    [smallMonitorViewOverride]: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
    },
  },
  freePlanDivider: {
    flexGrow: 1,
    width: '2px',
    minHeight: '20em',
    height: '100%',
    alignSelf: 'center',
    content: '""',
    background: 'linear-gradient(#FFFFFF00, #FFF 50%, #FFFFFF00 100%)',
    [smallMonitorViewOverride]: {
      minHeight: 'unset',
      width: '100%',
      height: '1px',
      background: 'linear-gradient(90deg, #FFFFFF00, #FFF 50%, #FFFFFF00 100%)',
    },
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  muted: {
    color: theme.fgMuted,
  },
  bold: {
    fontWeight: 700,
  },
}))

interface ICreditGrantOption {
  modelCount: number
  imageCount: number
}

const PricingConstants: Record<string, ICreditGrantOption> = {
  Free: {
    modelCount: 6,
    imageCount: 28,
  },
  Core: {
    modelCount: 125,
    imageCount: 285,
  },
  Power: {
    modelCount: 750,
    imageCount: 1785,
  },
}

const PricingPlanSection: React.FC = () => {
  const classes = useStyles()
  const {Free: FreePlan, CoreSub: CorePlan, PowerSub: PowerPlan} = CREDIT_GRANT_FEATURE
  const {FreeTopUp, CoreTopUp, PowerTopUp} = CREDIT_GRANT_FEATURE
  const {Free: FreePricing, Core: CorePricing, Power: PowerPricing} = PricingConstants
  const {t} = useTranslation(['pricing-page'])

  return (
    <AutoHeadingScope level={2}>
      <PricingPageSection id='pricing-plans' color='transparent'>
        <div className={classes.pricingPageSection}>
          <PricingGradientBackground />
          <PricingPlanCard title='FREE' color='gray'>

            <div className={classes.freePlanDetail}>
              <SpaceBetween direction='vertical' centered>
                <table className={classes.freePlanDetailTable}>
                  <tbody>
                    <tr>
                      <td align='right'>{t('pricing_page.plan.free.feature.label.team_size')}</td>
                      <td align='right'>1-10</td>
                    </tr>
                    <tr>
                      <td align='right'>
                        {t('pricing_page.plan.free.feature.label.commercial_use')}
                      </td>
                      <td align='right'><Icon size={2} stroke='checkmark' color='success' /></td>
                    </tr>
                    <tr>
                      <td align='right'>
                        {t('pricing_page.plan.free.feature.label.editor')}
                      </td>
                      <td align='right'><Icon size={2} stroke='checkmark' color='success' /></td>
                    </tr>
                    <tr>
                      <td align='right'>
                        {t('pricing_page.plan.free.feature.label.web_hosting')}
                      </td>
                      <td align='right'><Icon size={2} stroke='checkmark' color='success' /></td>
                    </tr>
                    <tr>
                      <td align='right'>
                        {t('pricing_page.plan.free.feature.label.native_app_export')}
                      </td>
                      <td align='right'><Icon size={2} stroke='checkmark' color='success' /></td>
                    </tr>
                    <tr>
                      <td align='right'>
                        {t('pricing_page.plan.free.feature.label.eighth_wall_agent')}
                      </td>
                      <td align='right'><Icon size={2} stroke='checkmark' color='success' /></td>
                    </tr>
                    <tr>
                      <td align='right'>
                        {t('pricing_page.plan.free.feature.label.ai_asset_lab')}
                      </td>
                      <td align='right'><Icon size={2} stroke='checkmark' color='success' /></td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  <Trans
                    ns='pricing-page'
                    i18nKey='pricing_page.plan.free.hint.text'
                    components={{
                      // eslint-disable-next-line max-len
                      1: <StandardLink color='main' underline to='/docs/account/projects/white-label/' />,
                    }}
                  />
                </p>
              </SpaceBetween>
              <div className={classes.freePlanDivider} />
              <SpaceBetween direction='vertical' centered>
                <PricingPlanPrice price={FreePlan.price} />
                <PricingCreditAmount amount={FreePlan.creditAmount} color='gray' />

                <SpaceBetween direction='vertical' justifyCenter>
                  <AutoHeading>
                    {t('credit_pricing_card.usage.subheading')}
                  </AutoHeading>
                  <SpaceBetween justifyCenter>
                    <div className={classes.muted}>
                      {t('credit_pricing_card.feature.free')}
                    </div>
                  </SpaceBetween>
                  <div className={combine(classes.row, classes.muted)}>
                    <div>{t('credit_pricing_card.label.asset_model_count')}</div>
                    <div>{FreePricing.modelCount}</div>
                  </div>
                  <div className={combine(classes.row, classes.muted)}>
                    <div>{t('credit_pricing_card.label.asset_image_count')}</div>
                    <div>{FreePricing.imageCount}</div>
                  </div>
                </SpaceBetween>

                <SpaceBetween direction='vertical' centered>
                  <AutoHeading>
                    {t('credit_pricing_card.subeading.top_up_credit_rate')}
                  </AutoHeading>
                  <div className={classes.muted}>
                    {t('credit_pricing_card.price_per_credit', {
                      price: formatToCurrency(
                        (FreeTopUp.price / FreeTopUp.creditAmount) * 100,
                        {currency: 'usd', decimalPlaces: 2}
                      ),
                    })}
                  </div>
                </SpaceBetween>
              </SpaceBetween>
            </div>
          </PricingPlanCard>
          <PricingPlanCard title='CORE' color='mint'>
            <PricingPlanPrice price={CorePlan.price} />
            <PricingCreditAmount amount={CorePlan.creditAmount} color='mint' />

            <SpaceBetween direction='vertical' justifyCenter>
              <AutoHeading>
                {t('credit_pricing_card.usage.subheading')}
              </AutoHeading>
              <SpaceBetween justifyCenter>
                <div className={classes.muted}>
                  {t('credit_pricing_card.feature.core')}
                </div>
              </SpaceBetween>
              <div className={combine(classes.row, classes.muted)}>
                <div>{t('credit_pricing_card.label.asset_model_count')}</div>
                <div>{CorePricing.modelCount}</div>
              </div>
              <div className={combine(classes.row, classes.muted)}>
                <div>{t('credit_pricing_card.label.asset_image_count')}</div>
                <div>{CorePricing.imageCount}</div>
              </div>
            </SpaceBetween>

            <SpaceBetween direction='vertical' centered>
              <AutoHeading>
                {t('credit_pricing_card.subeading.top_up_credit_rate')}
              </AutoHeading>
              <div className={classes.muted}>
                {t('credit_pricing_card.price_per_credit', {
                  price: formatToCurrency(
                    (CoreTopUp.price / CoreTopUp.creditAmount) * 100,
                    {currency: 'usd', decimalPlaces: 2}
                  ),
                })}
              </div>
              <Badge color='mint' variant='pastel'>
                {t('credit_pricing_card.discount', {
                  percentage: Math.round((CoreTopUp.price / FreeTopUp.price) * 100),
                })}
              </Badge>
            </SpaceBetween>
          </PricingPlanCard>
          <PricingPlanCard title='POWER' color='purple'>
            <PricingPlanPrice price={PowerPlan.price} />
            <PricingCreditAmount amount={PowerPlan.creditAmount} color='purple' />

            <SpaceBetween direction='vertical' justifyCenter>
              <AutoHeading>
                {t('credit_pricing_card.usage.subheading')}
              </AutoHeading>
              <SpaceBetween justifyCenter>
                <div className={classes.muted}>
                  {t('credit_pricing_card.feature.power')}
                </div>
              </SpaceBetween>
              <div className={combine(classes.row, classes.muted)}>
                <div>{t('credit_pricing_card.label.asset_model_count')}</div>
                <div>{PowerPricing.modelCount}</div>
              </div>
              <div className={combine(classes.row, classes.muted)}>
                <div>{t('credit_pricing_card.label.asset_image_count')}</div>
                <div>{PowerPricing.imageCount}</div>
              </div>
            </SpaceBetween>

            <SpaceBetween direction='vertical' centered>
              <AutoHeading>
                {t('credit_pricing_card.subeading.top_up_credit_rate')}
              </AutoHeading>
              <div className={classes.muted}>
                {t('credit_pricing_card.price_per_credit', {
                  price: formatToCurrency(
                    (PowerTopUp.price / PowerTopUp.creditAmount) * 100,
                    {currency: 'usd', decimalPlaces: 2}
                  ),
                })}
              </div>
              <Badge color='mint' variant='pastel'>
                {t('credit_pricing_card.discount', {
                  percentage: Math.round((1 - (PowerTopUp.price / FreeTopUp.price)) * 100),
                })}
              </Badge>
            </SpaceBetween>
          </PricingPlanCard>
        </div>
      </PricingPageSection>
    </AutoHeadingScope>
  )
}

export {PricingPlanSection}
