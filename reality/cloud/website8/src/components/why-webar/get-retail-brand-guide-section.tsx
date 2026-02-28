import React from 'react'
import HubspotForm from 'react-hubspot-form'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'

import downloadBrandGuideImg from '../../../img/why-webar/download-brand-guide.png'
import * as classes from './get-retail-brand-guide-section.module.scss'
import {WEBAR_HERO_CLAIM_FORM_MAP} from '../../common/hubspot-form-constants'

const GetRetailBrandGuideSection = () => {
  const {t, i18n} = useTranslation(['why-webar-page', 'common'])
  const hubspotFormId = WEBAR_HERO_CLAIM_FORM_MAP[i18n.language]

  return (
    <div id='download' className={classes.container}>
      <h2>{t('get_retail_brand_guide_form.header')}</h2>
      <p className='text8-lg font8-semibold'>{t('get_retail_brand_guide_form.subheader')}</p>
      <div className={classes.formContainer}>
        <div className={classes.claimForm}>
          <HubspotForm
            portalId='7182223'
            formId={hubspotFormId}
            loading={<div>{t('hubspot.form.loading_text', {ns: 'common'})}</div>}
          />
          <p className='text8-xs'>
            <Trans
              ns='why-webar-page'
              i18nKey='get_retail_brand_guide_form.disclaimer'
            >By submitting this form, I confirm that I have read and agree to the
              <a target='_blank' href='https://www.8thwall.com/privacy' rel='noreferrer'>
                Privacy Policy
              </a>.
            </Trans>

          </p>
        </div>
        <img
          className={classes.formImg}
          draggable={false}
          src={downloadBrandGuideImg}
          alt='Generated WebAR graphic'
        />
      </div>
    </div>
  )
}

export default GetRetailBrandGuideSection
