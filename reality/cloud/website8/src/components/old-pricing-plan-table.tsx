import React, {useState} from 'react'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'
import {Link} from 'gatsby'

import {bool, combine} from '../styles/classname-utils'
import PricingPlanCard from './old-pricing-plan-card'
import {blueberry, brandHighlight, gray2, gray3} from '../styles/brand-colors'
import * as classes from './pricing-plan-table.module.scss'

const PricingPlanTable = ({showAnnualPricing}) => {
  const {t} = useTranslation(['pricing-page'])
  const [show, setShow] = useState(0)

  const planGroup = (
    <>
      <div className={combine(
        classes.tableSubHeadCell,
        classes.tableSubHeadGray,
        'font8-bold'
      )}
      >
        <Trans
          ns='pricing-page'
          i18nKey='pricing_plan_table.for_small_teams'
        >
          For individuals &amp;<br className='d-block d-md-none' /> small teams
        </Trans>
      </div>
      <div className={combine(
        classes.tableSubHeadCell,
        classes.tableSubHeadHighlight,
        'font8-bold'
      )}
      >
        <Trans
          ns='pricing-page'
          i18nKey='pricing_plan_table.for_agencies'
        >
          For agencies &amp;<br className='d-block d-md-none' /> organizations
        </Trans>
      </div>
    </>
  )

  return (
    <div className='row m-0 justify-content-center mt-3'>
      <div
        className={combine(
          classes.cardButtonSection,
          'd-flex d-lg-none flex-column col-12 col-sm-10 p-0'
        )}
      >
        <div className={combine('d-flex', classes.tableSubHead)}>
          {planGroup}
        </div>
        <div
          role='group'
          className='btn-group btn-group-toggle d-flex justify-content-center'
        >
          <button
            type='button'
            className={combine('btn', classes.cardButton, bool(show === 0, 'active'))}
            onClick={() => setShow(0)}
          >
            Starter
          </button>
          <button
            type='button'
            className={combine('btn', classes.cardButton, bool(show === 1, 'active'))}
            onClick={() => setShow(1)}
          >
            Plus
          </button>
          <button
            type='button'
            className={combine('btn', classes.cardButton, bool(show === 2, 'active'))}
            onClick={() => setShow(2)}
          >
            Pro
          </button>
          <button
            type='button'
            className={combine('btn', classes.cardButton, bool(show === 3, 'active'))}
            onClick={() => setShow(3)}
          >
            All Inclusive
          </button>
        </div>
      </div>

      <div className={combine(classes.tableContainer, 'row justify-content-center')}>
        <div className={combine('d-none d-lg-flex', classes.tableSubHead)}>
          {planGroup}
        </div>
        <div className={classes.tablePlanRow}>
          <PricingPlanCard
            name='Starter'
            description={t('pricing_plan_table.starter_description')}
            priceNumber={showAnnualPricing ? '9' : '12'}
            billingText={showAnnualPricing &&
              <Trans
                ns='pricing-page'
                i18nKey='pricing_plan_table.starter_pricing'
              >
                <s>$144</s>&nbsp;<b>$108</b> / year
              </Trans>}
            accentColor={gray2}
            hide={show !== 0}
          >
            <span>
              <Trans
                ns='pricing-page'
                i18nKey='pricing_plan_table.starter_children.team_size'
              >
                <b>3</b> team members
              </Trans>
            </span>
            <span>{t('pricing_plan_table.starter_children.unlimited_projects')}</span>
            <span>{t('pricing_plan_table.starter_children.templates_modules')}</span>
            <span>{t('pricing_plan_table.starter_children.project_pushed_to_profile')}</span>
            <span>{t('pricing_plan_table.starter_children.forum_support')}</span>
          </PricingPlanCard>
          <PricingPlanCard
            name='Plus'
            description={t('pricing_plan_table.plus_description')}
            priceNumber={showAnnualPricing ? '49' : '59'}
            billingText={showAnnualPricing &&
              <Trans
                ns='pricing-page'
                i18nKey='pricing_plan_table.plus_pricing'
              >
                <s>$708</s>&nbsp;<b>$588</b> / year
              </Trans>}
            accentColor={gray3}
            hide={show !== 1}
          >
            <span>
              <Trans
                ns='pricing-page'
                i18nKey='pricing_plan_table.plus_children.everything_starter'
              >
                Everything <b>Starter</b> has, plus:
              </Trans>
            </span>
            <span>
              <Trans
                ns='pricing-page'
                i18nKey='pricing_plan_table.plus_children.team_size'
              >
                <b>6</b> team members
              </Trans>
            </span>
            <span>{t('pricing_plan_table.plus_children.url_parameters')}</span>
            <span>{t('pricing_plan_table.plus_children.direct_urls')}</span>
            <span>{t('pricing_plan_table.plus_children.custom_domains')}</span>
            <span>{t('pricing_plan_table.plus_children.email_support')}</span>
          </PricingPlanCard>
          <PricingPlanCard
            name='Pro'
            description={t('pricing_plan_table.pro_description')}
            priceNumber={showAnnualPricing ? '99' : '129'}
            billingText={showAnnualPricing &&
              <Trans
                ns='pricing-page'
                i18nKey='pricing_plan_table.pro_pricing'
              >
                <s>$1548</s>&nbsp;<b>$1188</b> / year
              </Trans>}
            accentColor={brandHighlight}
            hide={show !== 2}
            highlight
          >
            <span>
              <Trans
                ns='pricing-page'
                i18nKey='pricing_plan_table.pro_children.everything_plus'
              >
                Everything <b>Plus</b> has, plus:
              </Trans>
            </span>
            <span>
              <Trans
                ns='pricing-page'
                i18nKey='pricing_plan_table.pro_children.unlimited_seats'
                components={{
                  b: <b />,
                }}
              />
            </span>
            <span>
              <Trans
                ns='pricing-page'
                i18nKey='pricing_plan_table.pro_children.commercial_use'
                components={{
                  a: <Link to='/pricing#commercial-license' />,
                }}
              />
            </span>
            <span>{t('pricing_plan_table.pro_children.self_hosting')}</span>
            <span>{t('pricing_plan_table.pro_children.optional_portfolio_page')}</span>
            <span>
              <Trans
                ns='pricing-page'
                i18nKey='pricing_plan_table.pro_children.featured_on_discover'
                components={{
                  a: (
                    <a
                      href='/discover'
                      target='_blank'
                      rel='noopener noreferrer'
                    >8thwall.com/discover
                    </a>
                  ),
                }}
              />

            </span>
            <span>{t('pricing_plan_table.pro_children.permissions')}</span>
          </PricingPlanCard>
          <PricingPlanCard
            name='All Inclusive'
            description={t('pricing_plan_table.enterprise_description')}
            accentColor={blueberry}
            hide={show !== 3}
          >
            <span>
              <Trans
                ns='pricing-page'
                i18nKey='pricing_plan_table.enterprise_children.everything_pro'
              >
                Everything <b>Pro</b> has, plus:
              </Trans>
            </span>
            <span>{t('pricing_plan_table.enterprise_children.commercial_use')}</span>
            <span>{t('pricing_plan_table.enterprise_children.image_api_access')}</span>
            <span>{t('pricing_plan_table.enterprise_children.tech_support')}</span>
          </PricingPlanCard>
        </div>
      </div>
    </div>
  )
}

export default PricingPlanTable
