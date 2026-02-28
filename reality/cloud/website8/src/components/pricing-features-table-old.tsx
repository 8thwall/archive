import React, {useEffect, useState} from 'react'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'

import {bool, combine} from '../styles/classname-utils'
import * as classes from './pricing-features-table.module.scss'
import checkMarkGreen from '../../img/checkmark-green.svg'
import xmark from '../../img/xmark.svg'

const PricingFeaturesTable = (showFeaturesTable) => {
  const {t} = useTranslation(['pricing-page'])
  const [sticky, setSticky] = useState(false)
  const featured = (
    <img
      className={classes.featuredIcon}
      src={checkMarkGreen}
      alt='Featured'
    />
  )
  const notFeatured = (
    <img
      className={classes.notFeaturedIcon}
      src={xmark}
      alt='Not Featured'
    />
  )
  const infinity = (
    <b className={combine('text-center', classes.unlimitedFont)}>
      {t('pricing_feature_table.unlimited')}
    </b>
  )
  const rowHeader = classes.tableRowHeader
  const tableSubHeader = combine(classes.tableSubHeader, 'text-center text-md-left font8-bold')
  const tableCell = combine('d-flex justify-content-center align-items-center', classes.tableCell)
  const tableRow = combine('d-flex flex-wrap', classes.tableRow)

  useEffect(() => {
    if (sticky) {
      setSticky(false)
    } else {
      setTimeout(() => { setSticky(true) }, 500)
    }
  }, [showFeaturesTable])

  return (
    <div className={classes.tableContainer}>
      <div className={combine(bool(sticky, 'sticky-top'), classes.tableHeader, tableRow)}>
        <div className={rowHeader}>
          {t('pricing_feature_table.features')}
        </div>
        <div className={tableCell}>Starter</div>
        <div className={tableCell}>Plus</div>
        <div className={tableCell}>Pro</div>
        <div className={tableCell}>All Inclusive</div>
      </div>

      <div className={tableSubHeader}>
        {t('pricing_feature_table.subheader.engine')}
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.engine')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.modular_camera_framework')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.metaversal_deployment')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.media_recorder')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.holograms')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.avatar_integrations')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.shared_ar')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.exclusive_platform_apis')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>

      <div className={tableSubHeader}>
        {t('pricing_feature_table.subheader.project_development')}
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.team_size')}
        </div>
        <div className={tableCell}><b>3</b></div>
        <div className={tableCell}><b>6</b></div>
        <div className={tableCell}>{infinity}</div>
        <div className={tableCell}>{infinity}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.develop_web_applications')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.purchase_licenses')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{notFeatured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.custom_contracts_invoicing')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.volume_pricing')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.share_projects')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.accept_invites')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>

      <div className={tableSubHeader}>
        {t('pricing_feature_table.subheader.developer_tools')}
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.cloud_editor')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.remote_debugging')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.source_control')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.local_development')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.payments')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.external_analytics')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.concurrent_users_shared_ar')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}><b>100</b></div>
        <div className={tableCell}><b>250</b></div>
        <div className={tableCell}><b>{t('pricing_feature_table.custom')}</b></div>
      </div>

      <div className={tableSubHeader}>
        {t('pricing_feature_table.subheader.publishing_sharing')}
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.unlimited_projects')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.cloud_hosting')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.self_hosting')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.password_protection')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.remove_splash_screen')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          <Trans
            ns='pricing-page'
            i18nKey='pricing_feature_table.public_profile'
          >
            Public Profile on <a href='/'>8thwall.com</a>
          </Trans>
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          <Trans
            ns='pricing-page'
            i18nKey='pricing_feature_table.feature_projects'
          >
            Feature projects on <a href='/discover'>8thwall.com/discover</a>
          </Trans>
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.direct_urls')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.custom_domains')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.pwas')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.embeddable_webar')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>

      <div className={tableSubHeader}>
        {t('pricing_feature_table.subheader.resources_support')}
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.project_templates')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.modules')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.slack_community')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.tutorials')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.email_support')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.tech_support')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.partner_program')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
    </div>
  )
}

export default PricingFeaturesTable
