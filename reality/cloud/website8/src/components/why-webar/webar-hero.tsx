import React from 'react'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import * as classes from './webar-hero.module.scss'

const WebARHeroSection = () => {
  const {t} = useTranslation(['why-webar-page'])

  return (
    <section className={classes.heroSection}>
      <svg
        className={classes.heroDivider}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 1440 410'
        fill='none'
        height='1440px'
      >
        {/* eslint-disable-next-line max-len */}
        <path d='M0 0H1440V363.016C1440 363.016 1206.5 455.557 760 380.889C313.5 306.22 0 409.882 0 409.882V0Z' fill='#582E9E' />
      </svg>
      <div className={classes.titleContainer}>
        <h2 className={classes.heading}>{t('hero_section.heading')}</h2>
        <h3 className={classes.subHeading}>{t('hero_section.subheading')}</h3>
      </div>
      <div className={classes.cardContainer}>
        <div className={classes.brandGuideCard}>
          <h2 className='text8-xl'>{t('hero_section.brand_guide.title')}</h2>
          <p className='text8-sm'>{t('hero_section.brand_guide.description')}</p>
          <a href='#download'>
            {t('hero_section.brand_guide.button.download')}
          </a>
        </div>
        <div className={classes.heroImg} />
      </div>
    </section>
  )
}

export default WebARHeroSection
