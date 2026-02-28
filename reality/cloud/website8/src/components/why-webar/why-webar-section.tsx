import React from 'react'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import * as classes from './why-webar-section.module.scss'
import {combine} from '../../styles/classname-utils'
import Reason from './webar-reason'

import massiveReach from '../../../img/why-webar/massive-reach.svg'
import provenImpact from '../../../img/why-webar/proven-impact.svg'
import noAppRequired from '../../../img/why-webar/no-app-required.svg'

const WebARReasonsSection = () => {
  const {t} = useTranslation(['why-webar-page', 'common'])

  return (
    <section>
      <h2 className='text-center h2-xl'>{t('why_webar_section.heading')}</h2>
      <p className={combine('text8-lg noto-sans-jp font8-medium', classes.whyWebARCopy)}>
        {t('why_webar_section.description')}
      </p>
      <div className={combine('row', 'text-center', classes.reasons)}>
        <Reason
          icon={massiveReach}
          title={t('why_webar_section.reason.massive_reach.title')}
        >
          {t('why_webar_section.reason.massive_reach.description')}
        </Reason>
        <Reason
          icon={provenImpact}
          title={t('why_webar_section.reason.proven_impact.title')}
        >
          {t('why_webar_section.reason.proven_impact.description')}
        </Reason>
        <Reason
          icon={noAppRequired}
          title={t('why_webar_section.reason.no_app_required.title')}
        >
          {t('why_webar_section.reason.no_app_required.description')}
        </Reason>
      </div>
    </section>
  )
}

export default WebARReasonsSection
