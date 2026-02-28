import React from 'react'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import * as styles from './pricing-license-table.module.scss'
import {combine} from '../styles/classname-utils'

const LicensePricingTable = () => {
  const {t} = useTranslation(['pricing-page'])

  return (
    <div className={combine('mb-5', styles.container)}>
      <div className={styles.smallMonitorView}>
        <div className={styles.row}>
          <div className={combine(styles.tableCell, 'noto-sans-jp font8-bold')}>
            {t('license_prices_table.billing_frequency.monthly')}
          </div>
          <div className={combine(styles.tableCell, 'font8-bold')}>
            {t('license_prices_table.payment.monthly')}
          </div>
          <div className={combine(styles.tableCell, styles.grayColor, 'font8-bold')}>
            {t('license_prices_table.savings.no_savings')}
          </div>
        </div>
        <div className={styles.row}>
          <div className={combine(styles.tableCell, 'noto-sans-jp font8-bold')}>
            {t('license_prices_table.billing_frequency.quarterly')}
          </div>
          <div className={combine(styles.tableCell, 'font8-bold')}>
            {t('license_prices_table.payment.every_3_months')}
          </div>
          <div className={combine(styles.tableCell, 'font8-bold')}>
            {t('license_prices_table.savings.quarterly')}
          </div>
        </div>
        <div className={styles.row}>
          <div className={combine(styles.tableCell, 'noto-sans-jp font8-bold')}>
            {t('license_prices_table.billing_frequency.semi_annual')}
          </div>
          <div className={combine(styles.tableCell, 'font8-bold')}>
            {t('license_prices_table.payment.every_6_months')}
          </div>
          <div className={combine(styles.tableCell, 'font8-bold')}>
            {t('license_prices_table.savings.semi-annual')}
          </div>
        </div>
        <div className={styles.row}>
          <div
            className={combine(styles.tableCell, styles.bestValueCell, 'noto-sans-jp font8-bold')}
          >
            <div className={styles.bestValue}>
              {t('license_prices_table.best_value')}
            </div>
            {t('license_prices_table.billing_frequency.annual')}
          </div>
          <div className={combine(styles.tableCell, 'font8-bold')}>
            {t('license_prices_table.payment.every_12_months')}
          </div>
          <div className={combine(styles.tableCell, 'font8-bold')}>
            {t('license_prices_table.savings.annual')}
          </div>
        </div>
      </div>

      <div className={combine(styles.mobileView, styles.column)}>
        <div className={styles.columnItem}>
          <h2 className='noto-sans-jp font8-bold'>
            {t('license_prices_table.billing_frequency.monthly')}
          </h2>
          <p className='text8-md font8-semibold'>
            {t('license_prices_table.payment.monthly')}
          </p>
          <p className={combine(styles.grayColor, 'text8-md font8-semibold')}>
            {t('license_prices_table.savings.no_savings')}
          </p>
        </div>

        <div className={styles.columnItem}>
          <h2 className='noto-sans-jp font8-bold'>
            {t('license_prices_table.billing_frequency.quarterly')}
          </h2>
          <p className='text8-md font8-semibold'>
            {t('license_prices_table.payment.every_3_months')}
          </p>
          <p className={combine(styles.purpleColor, 'text8-md font8-semibold')}>
            {t('license_prices_table.savings.quarterly')}
          </p>
        </div>

        <div className={styles.columnItem}>
          <h2 className='noto-sans-jp font8-bold'>
            {t('license_prices_table.billing_frequency.semi_annual')}
          </h2>
          <p className='text8-md font8-semibold'>
            {t('license_prices_table.payment.every_6_months')}
          </p>
          <p className={combine(styles.purpleColor, 'text8-md font8-semibold')}>
            {t('license_prices_table.savings.semi-annual')}
          </p>
        </div>

        <div className={styles.columnItem}>
          <div className={styles.bestValue}>
            {t('license_prices_table.best_value')}
          </div>
          <h2 className='noto-sans-jp font8-bold'>
            {t('license_prices_table.billing_frequency.annual')}
          </h2>
          <p className='text8-md font8-semibold'>
            {t('license_prices_table.payment.every_12_months')}
          </p>
          <p className={combine(styles.purpleColor, 'text8-md font8-semibold')}>
            {t('license_prices_table.savings.annual')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default LicensePricingTable
