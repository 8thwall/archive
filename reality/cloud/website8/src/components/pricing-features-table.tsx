import React, {useEffect, useState} from 'react'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'

import {bool, combine} from '../styles/classname-utils'
import * as classes from './pricing-features-table.module.scss'
import checkMarkGreen from '../../img/checkmark-green.svg'
import dashMark from '../../img/dash-mark.svg'

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
      src={dashMark}
      alt='Not Featured'
    />
  )
  const infinity = (
    <b className={combine('text-center', classes.unlimitedFont)}>
      {t('pricing_feature_table.unlimited')}
    </b>
  )
  const rowHeader = classes.tableRowHeader
  const tableSubHeader = combine(classes.tableSubHeader, 'text-md-left font8-bold')
  const tableCell = combine('d-flex justify-content-center align-items-center', classes.tableCell)
  const tableRow = combine('d-flex flex-wrap', classes.tableRow)

  useEffect(() => {
    if (sticky) {
      setSticky(false)
    } else {
      setTimeout(() => {setSticky(true)}, 500)
    }
  }, [showFeaturesTable])

  return (
    <div className={classes.tableContainer}>
      <div className={combine(bool(sticky, 'sticky-top'), classes.tableHeader, tableRow)}>
        <div className={rowHeader}>
          {t('pricing_feature_table.features')}
        </div>
        <div className={tableCell}><p><b>BASIC</b></p></div>
        <div className={tableCell}><p><b>PRO</b> Marketing</p></div>
      </div>
      <div className={tableSubHeader}>
        {t('pricing_feature_table.subheader.engine')}
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.world_effects')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.face_effects')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.sky_effects')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.hand_tracking')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.subheader.image_targets')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.subheader.image_target_management_api')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.vps')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.private_vps')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.gsb')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.media_recorder')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.3d_web_development')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.metaversal_deployment')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>

      <div className={tableSubHeader}>
        {t('pricing_feature_table.subheader.project_development')}
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.team_size')}
        </div>
        <div className={tableCell}>{infinity}</div>
        <div className={tableCell}>{infinity}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.create_branded_content')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.license_management')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.purchase_licenses')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.share_projects')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.accept_invites')}
        </div>
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
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.cloud_studio')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.frameworks')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.backend_services')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.remote_debugging')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.local_development')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.payments')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.external_analytics')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>

      <div className={tableSubHeader}>
        {t('pricing_feature_table.subheader.publishing_sharing')}
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.unlimited_noncommercial_projects')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.cloud_hosting')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.self_hosting')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.remove_splash_screen')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.private_publishing')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
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
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.custom_domains')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>

      <div className={tableSubHeader}>
        {t('pricing_feature_table.subheader.resources_support')}
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.templates_and_modules')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.forum_support')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.slack_community')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.tutorials')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.email_support')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.partner_program')}
        </div>
        <div className={tableCell}>{notFeatured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
      <div className={tableRow}>
        <div className={rowHeader}>
          {t('pricing_feature_table.course_access')}
        </div>
        <div className={tableCell}>{featured}</div>
        <div className={tableCell}>{featured}</div>
      </div>
    </div>
  )
}

export default PricingFeaturesTable
