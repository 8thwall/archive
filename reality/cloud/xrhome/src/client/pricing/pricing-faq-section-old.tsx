import React from 'react'
import {useTranslation, Trans} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {
  headerSanSerif, mobileViewOverride, smallMonitorViewOverride,
} from '../static/styles/settings'
import {PricingFAQQuestion} from './pricing-faq-question-old'
import {PricingFAQRenderer} from './pricing-faq-renderer-old'

const useStyles = createUseStyles({
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 2em 4em',
    gap: '1em',
  },
  heading: {
    fontFamily: headerSanSerif,
    fontWeight: 900,
    textAlign: 'center',
    fontSize: '1.75em',
    lineHeight: '1.25em',
    marginTop: '1em',
    scrollMarginTop: '5em',
    [mobileViewOverride]: {
      fontSize: '1.5em',
    },
  },
  description: {
    fontSize: '1.25em',
    textAlign: 'center',
  },
  questions: {
    width: '100%',
    display: 'grid',
    rowGap: '0.75em',
    [smallMonitorViewOverride]: {
      maxWidth: '100%',
    },
  },
})

const PricingFaqSection = () => {
  const {t} = useTranslation(['pricing-page'])
  const classes = useStyles()

  return (
    <section className={classes.section}>
      <div id='faq' className={classes.heading}>
        {t('pricing_faq_section.heading')}
      </div>
      <div className={classes.questions}>
        <PricingFAQQuestion
          qid='what-are-credits'
          title={t('pricing_faq.what_are_credits')}
          answer={(
            <PricingFAQRenderer pathName='what-are-credits' />
          )}
        />
        <PricingFAQQuestion
          qid='do-credits-refresh'
          title={t('pricing_faq.do_credits_refresh')}
          answer={(
            <PricingFAQRenderer pathName='do-credits-refresh' />
          )}
        />
        <PricingFAQQuestion
          qid='what-is-included-with-free-account'
          title={t('pricing_faq.what_is_included_with_free_account')}
          answer={(
            <PricingFAQRenderer pathName='what-is-included-with-free-account' />
          )}
        />
        <PricingFAQQuestion
          qid='what-is-white-label-subscription'
          title={t('pricing_faq.what_is_white_label_subscription')}
          answer={(
            <PricingFAQRenderer pathName='what-is-white-label-subscription' />
          )}
        />
        <PricingFAQQuestion
          qid='cancellation-policy'
          title={t('pricing_faq.cancellation_policy')}
          answer={(
            <PricingFAQRenderer pathName='cancellation-policy' />
          )}
        />
        <PricingFAQQuestion
          qid='what-happens-when-white-label-expires'
          title={t('pricing_faq.what_happens_when_white_label_expires')}
          answer={(
            <PricingFAQRenderer pathName='what-happens-when-white-label-expires' />
          )}
        />
        <PricingFAQQuestion
          qid='what-project-requires'
          title={t('pricing_faq.what_project_requires')}
          answer={(
            <PricingFAQRenderer pathName='what-project-requires' />
          )}
        />
        <PricingFAQQuestion
          qid='what-is-a-view'
          title={t('pricing_faq.what_is_a_view')}
          answer={(
            <PricingFAQRenderer pathName='what-is-a-view' />
          )}
        />
        <PricingFAQQuestion
          qid='what-hosting-does-8thwall-provide'
          title={t('pricing_faq.what_hosting_offered')}
          answer={(
            <PricingFAQRenderer pathName='what-hosting-does-8thwall-provide' />
          )}
        />
      </div>
      <div className={classes.heading}>
        {t('pricing_faq_section.heading.still_have_questions')}
      </div>
      <div className={classes.description}>
        <Trans
          ns='pricing-page'
          i18nKey='pricing_faq_section.description.still_have_questions'
          components={{
            1: <a href='https://forum.8thwall.com/' />,
          }}
        />
      </div>
    </section>
  )
}

export {PricingFaqSection}
