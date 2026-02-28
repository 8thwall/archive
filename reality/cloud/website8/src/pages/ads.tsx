import React, {useState} from 'react'
import {Trans, useTranslation} from 'gatsby-plugin-react-i18next'
import {Link, graphql} from 'gatsby'

import Layout from '../components/layouts/layout'
import Button8 from '../components/button8'
import AdCard from '../components/ads/ads-card'
import checkMark from '../../img/checkmark_developlicense_3x.png'
import aloeDesignChairVid from '../../img/vids/aloe-design-chair.mp4'
import aloeDesignChairPoster from '../../img/aloe-design-chair-poster.jpg'
import displaySample from '../../img/ping_pong_table.png'
import * as classes from '../components/ads/embed.module.scss'
import {bool, combine} from '../styles/classname-utils'

export default () => {
  const {t} = useTranslation(['ads-page'])
  const [show, setShow] = useState(0)

  return (
    <Layout
      title={t('page.title')}
      description={t('page.meta_description')}
    >
      <div className={classes.embedPage}>
        <section className='pb-2 justify-content-center'>
          <h1 className='text-center'>{t('page.heading')}</h1>
          <p className={combine('noto-sans-jp text-center text8-lg m-auto', classes.embedPageText)}>
            {t('page.description')}
          </p>
          <div className={combine('mt-4 mx-auto justify-content-center', classes.checkmarkSection)}>
            <div className={combine(
              'col-md-4 text-md-center align-items-center',
              classes.checkmarkItem
            )}
            >
              <img className={classes.checkmarkIcon} src={checkMark} alt='Check Mark' />
              <p className='text8-md font8-semibold'>
                {t('check_mark_section.item.advanced_audience_targeting')}
              </p>
            </div>
            <div className={combine(
              'col-md-4 text-md-center align-items-center',
              classes.checkmarkItem
            )}
            >
              <img className={classes.checkmarkIcon} src={checkMark} alt='Check Mark' />
              <p className='text8-md font8-semibold'>
                {t('check_mark_section.item.robust_measurement_and_optimization')}
              </p>
            </div>
            <div className={combine(
              'col-md-4 text-md-center align-items-center',
              classes.checkmarkItem
            )}
            >
              <img className={classes.checkmarkIcon} src={checkMark} alt='Check Mark' />
              <p className='text8-md font8-semibold'>
                {t('check_mark_section.item.responsive_interactive_creative')}
              </p>
            </div>
          </div>
          <div className={combine('row justify-content-center d-md-flex', classes.embedFormButton)}>
            <Link
              to='/ads/request-ad'
              a8='click;ar-ads;click-ads-cta'
            >
              <Button8>{t('check_mark_section.button.get_started')}</Button8>
            </Link>
          </div>
        </section>

        <section className='py-md-0'>
          <div
            role='group'
            className={combine(
              classes.embedCardButtonSection,
              'btn-group-vertical btn-group-toggle d-flex flex-column mx-auto',
              'd-md-none d-sm-block'
            )}
          >
            <button
              type='button'
              className={combine('btn', classes.embedCardButton, bool(show === 0, 'active'))}
              onClick={() => setShow(0)}
            >
              Embeddable AR Ads
            </button>
            <button
              type='button'
              className={combine('btn', classes.embedCardButton, bool(show === 1, 'active'))}
              onClick={() => setShow(1)}
            >
              Display Ads
            </button>
          </div>

          <div className={combine('d-flex justify-content-center', classes.embedCardSection)}>
            <AdCard
              className={bool(show !== 0, 'd-none')}
              header={t('embed_card_section.ad_card.embeddable_ar_ads.header')}
              description={t('embed_card_section.ad_card.embeddable_ar_ads.description')}
              demoLink='https://ads-demo.8thwall.com/'
              a8='click;ar-ads;click-embeddable-try-demo'
              highlight
            >
              <video
                className='mb-3 rounded'
                width='100%'
                preload='auto'
                poster={aloeDesignChairPoster}
                loop
                autoPlay
                muted
                playsInline
              >
                <source src={aloeDesignChairVid} type='video/mp4' />
                {t('embed_card_section.ad_card.embeddable_ar_ads.blurb.not_supported')}
              </video>
            </AdCard>
            <AdCard
              className={bool(show !== 1, 'd-none')}
              header={t('embed_card_section.ad_card.display_ads.header')}
              description={t('embed_card_section.ad_card.display_ads.description')}
            >
              <img
                className='mb-3 rounded'
                src={displaySample}
                alt={t('embed_card_section.ad_card.display_ads.img_alt')}
              />
            </AdCard>
          </div>
        </section>

        <section className={combine('pt-1 mb-4 mx-auto', classes.socialProofSection)}>
          <div className={classes.socialProofCard}>
            <div className={combine('font8-black noto-sans-jp', classes.socialProofStat)}>70%</div>
            <div className={combine('text8-md', classes.socialProofText)}>
              <p className='m-0'>
                <Trans
                  ns='ads-page'
                  i18nKey='social_proof_section.heading'
                >
                  of consumers agree or strongly agree with
                  <br className='d-sm-flex d-none' />
                  <span className='font-weight-bold'>
                    I’d like to see more Augmented Reality Ads in the future.
                  </span>
                </Trans>
              </p>
            </div>
          </div>
          <p className={classes.socialProofSource}>{t('social_proof_section.source')}</p>
        </section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
