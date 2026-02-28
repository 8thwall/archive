import React from 'react'
import {useTranslation} from 'react-i18next'

import {useRecommendedContentStyles} from './recommended-content-styles'
import {RecommendedItem} from './recommended-item'
import baseCover from '../../static/report-cover/base.jpg'
import fashionCover from '../../static/report-cover/fashion-image.png'
import entertainmentCover from '../../static/report-cover/entertainment-image.png'
import cpgCover from '../../static/report-cover/cpg-image.png'
import retailCover from '../../static/report-cover/retail-image.png'
import coreCapabilitiesCover from '../../static/report-cover/core-capabilities-image.png'
import {
  BRANDING_GDRIVE_URL,
  CORE_CAPABILITIES_URL,
  RETAIL_DRIVE_URL,
  CPG_DRIVE_URL,
  ENTERTAINMENT_DRIVE_URL,
  FASHION_DRIVE_URL,
} from './recommeded-content-constants'

const ReportView: React.FC = () => {
  const {t} = useTranslation(['account-pages'])
  const classes = useRecommendedContentStyles()

  return (
    <div className={classes.contentContainer}>
      <RecommendedItem
        a8='click;warm-start;click-8th-wall-advantage'
        url={CORE_CAPABILITIES_URL}
        image={coreCapabilitiesCover}
        alt={t('my_projects_page.reports_view.8th_wall_advantage_alt')}
      >
        {t('my_projects_page.reports_view.8th_wall_advantage')}
      </RecommendedItem>
      <RecommendedItem
        a8='click;warm-start;click-cpg'
        url={CPG_DRIVE_URL}
        image={cpgCover}
        alt={t('my_projects_page.reports_view.cpg_alt')}
      >
        {t('my_projects_page.reports_view.cpg')}
      </RecommendedItem>
      <RecommendedItem
        a8='click;warm-start;click-entertainment-guide'
        url={ENTERTAINMENT_DRIVE_URL}
        image={entertainmentCover}
        alt={t('my_projects_page.reports_view.entertainment_guide_alt')}
      >
        {t('my_projects_page.reports_view.entertainment_guide')}
      </RecommendedItem>
      <RecommendedItem
        a8='click;warm-start;click-fashion-guide'
        url={FASHION_DRIVE_URL}
        image={fashionCover}
        alt={t('my_projects_page.reports_view.fashion_guide_alt')}
      >
        {t('my_projects_page.reports_view.fashion_guide')}
      </RecommendedItem>
      <RecommendedItem
        a8='click;warm-start;click-retail-guide'
        url={RETAIL_DRIVE_URL}
        image={retailCover}
        alt={t('my_projects_page.reports_view.retail_guide_alt')}
      >
        {t('my_projects_page.reports_view.retail_guide')}
      </RecommendedItem>
      <RecommendedItem
        a8='click;warm-start;click-report-8th-wall-branding-guide'
        url={BRANDING_GDRIVE_URL}
        image={baseCover}
        alt={t('my_projects_page.reports_view.badge_guidelines_alt')}
      >
        {t('my_projects_page.reports_view.badge_guidelines')}
      </RecommendedItem>
    </div>
  )
}

export {ReportView}
