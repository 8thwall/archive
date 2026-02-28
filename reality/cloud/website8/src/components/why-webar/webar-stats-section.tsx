import React from 'react'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import {combine} from '../../styles/classname-utils'
import * as classes from './webar-stats.module.scss'

const WebARStatsSection = () => {
  const {t} = useTranslation(['why-webar-page'])

  return (
    <section className='purple text-white'>
      <h2 className='text-center h2-xl'>{t('webar_stats_section.heading')}</h2>
      <p className={combine(
        'text-center mx-auto col-md-11 col-lg-12 font8-semibold',
        classes.subtitle
      )}
      >{t('webar_stats_section.description')}
      </p>
      <div className={combine('row', classes.stats)}>
        <div className='col-lg-4 px-lg-4 col-md-8'>
          <hr className={classes.divider} />
          <p className={combine('noto-sans-jp mb-0', classes.jumboText)}>
            5<span className='text8-xl'>min+</span>
          </p>
          <p className='text8-xl noto-sans-jp font8-black mb-2 mb-md-3'>
            {t('webar_stats_section.stat.dwell_time.title')}
          </p>
          <p className='text8-md font8-semibold'>
            {t('webar_stats_section.stat.dwell_time.description')}
          </p>
        </div>
        <div className='col-lg-4 px-lg-4 col-md-8'>
          <hr className={classes.divider} />
          <p className={combine('noto-sans-jp mb-0', classes.jumboText)}>
            18<span className='text8-xl'>%</span>
          </p>
          <p className='text8-xl noto-sans-jp font8-black mb-2 mb-md-3'>
            {t('webar_stats_section.stat.click_through_rate.title')}
          </p>
          <p className='text8-md'>
            {t('webar_stats_section.stat.click_through_rate.description')}
          </p>
        </div>
        <div className='col-lg-4 px-lg-4 col-md-8'>
          <hr className={classes.divider} />
          <p className={combine('noto-sans-jp mb-0', classes.jumboText)}>
            48<span className='text8-xl'>%</span>
          </p>
          <p className='text8-xl noto-sans-jp font8-black mb-2 mb-md-3'>
            {t('webar_stats_section.stat.increase_in_sales.title')}
          </p>
          <p className='text8-md'>
            {t('webar_stats_section.stat.increase_in_sales.description')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default WebARStatsSection
