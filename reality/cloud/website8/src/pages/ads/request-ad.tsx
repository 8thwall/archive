import React from 'react'
import HubspotForm from 'react-hubspot-form'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'
import {graphql} from 'gatsby'

import Layout from '../../components/layouts/layout'
import {combine} from '../../styles/classname-utils'
import * as classes from './request-ad.module.scss'
import {REQUEST_AD_FORM_MAP} from '../../common/hubspot-form-constants'

const RequestAd = () => {
  const {i18n, t} = useTranslation(['request-ad-page'])
  const hubspotFormId = REQUEST_AD_FORM_MAP[i18n.language]

  return (
    <Layout title={t('page.title', 'common')}>
      <section className={classes.requestSection}>
        <div
          className={combine('row justify-content-center flex-nowrap', classes.requestContainer)}
        >
          <div className='col-xl-6 col-lg-8 col-md-8 col-sm-12 mx-auto'>
            <h2>{t('page.title')}</h2>
            <HubspotForm
              portalId='7182223'
              formId={hubspotFormId}
              loading={<div>{t('hubspot.form.loading_text', {ns: 'common'})}</div>}
            />
          </div>
          <div
            className={combine('col-xl-3 col-lg-4 col-md-4 col-sm-0 mx-auto', classes.emodoUpsell)}
          >
            <div className={classes.emodoSocialProof}>
              <h2 className={classes.emodoSocialProofPercent}>74%</h2>
              <p className={classes.emodoSocialProofDescription}>
                <Trans
                  ns='request-ad-page'
                  i18nKey='description.emodo_social_proof'
                >
                  of consumers agree that<br />
                  <span>AR ads grab their attention more than normal ads.</span>
                </Trans>
              </p>
            </div>
            <p className={classes.emodoSocialProofSource}>
              {t('source.emodo_social_proof')}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default RequestAd

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
