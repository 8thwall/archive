import React from 'react'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import * as classes from './industry-section.module.scss'
import Button8 from '../button8'
import IndustrySectionLogos from './industry-section-logos'
import {combine} from '../../styles/classname-utils'

const IndustrySection = () => {
  const {t} = useTranslation(['why-webar-page'])
  return (
    <section className={classes.industrySectionContainer}>
      <h2 className='text-center h2-xl'>{t('industry_section.heading')}</h2>
      <p className='text-center text8-lg font8-semibold'>
        {t('industry_section.description')}
      </p>
      <IndustrySectionLogos />
      <div className='row justify-content-center mt-lg-5 mt-3'>
        <a
          className={classes.button}
          href='/industry-solutions'
          a8='click;why-webar;click-category-explore-more'
        >
          <Button8 className={combine('mb-lg-0 mb-3', classes.button)}>
            {t('industry_section.button.explore_more')}
          </Button8>
        </a>
      </div>
    </section>
  )
}

export default IndustrySection
