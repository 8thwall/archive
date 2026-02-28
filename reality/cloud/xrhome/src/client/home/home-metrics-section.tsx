import React from 'react'
import {useTranslation} from 'react-i18next'

import {createThemedStyles} from '../ui/theme'
import {hexColorWithAlpha} from '../../shared/colors'
import {brand8Purple} from '../ui/colors'
import {mobileViewOverride, tinyViewOverride} from '../static/styles/settings'
import noiseBg from '../static/brandrefresh/noise.svg'
import {combine} from '../common/styles'

const useStyles = createThemedStyles(theme => ({
  section: {
    display: 'flex',
    gap: '2.75em',
    justifyContent: 'center',
    padding: '2.5em 2em',
    flexDirection: 'column',
    alignItems: 'center',
    [mobileViewOverride]: {
      padding: '1.75em 1em',
    },
  },
  metricsGroup: {
    display: 'flex',
    gap: '1em',
    justifyContent: 'center',
    alignItems: 'stretch',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  metricsContainer: {
    position: 'relative',
    maxWidth: '34em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.25em',
    flex: 1,
    padding: '1.75em',
    borderRadius: '0.825em',
    background: `linear-gradient(180deg, ${hexColorWithAlpha(theme.bgMain, 0.1)} 0%, ` +
      `${hexColorWithAlpha(brand8Purple, 0.1)} 100%), ${theme.bgMain}`,
    [mobileViewOverride]: {
      maxWidth: 'unset',
    },
  },
  noise: {
    '&::before': {
      content: '""',
      position: 'absolute',
      height: '100%',
      width: '100%',
      top: '0',
      left: '0',
      opacity: '50%',
      overflow: 'hidden',
      background: `url(${noiseBg})`,
      borderRadius: '0.825em',
    },
  },
  sectionHeading: {
    fontFamily: theme.headingFontFamily,
    fontSize: '2em',
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: '1em',
  },
  headingContainer: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: '2',
  },
  heading: {
    fontFamily: theme.headingFontFamily,
    color: theme.fgMain,
    fontSize: '4em',
    lineHeight: '1em',
    fontWeight: 700,
    [mobileViewOverride]: {
      fontSize: '2.25em',
    },
  },
  subheading: {
    fontFamily: theme.bodyFontFamily,
    color: theme.fgMain,
    fontSize: '1.125em',
  },
  description: {
    color: theme.fgMuted,
    fontFamily: theme.subHeadingFontFamily,
    fontSize: '1.125em',
    lineHeight: '1.5em',
    zIndex: '2',
    [mobileViewOverride]: {
      fontSize: '1em',
    },
  },
}))

const HomeMetricsSection: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation('public-featured-pages')

  const metricsContainer = (
    heading: string,
    subheading: string,
    description: string
  ) => (
    <div className={combine(classes.metricsContainer, classes.noise)}>
      <div className={classes.headingContainer}>
        <div className={classes.heading}>
          {heading}
        </div>
        <div className={classes.subheading}>
          {subheading}
        </div>
      </div>
      <div className={classes.description}>
        {description}
      </div>
    </div>
  )

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeading}>
        {t('home_page.metrics_section.heading.build_real_projects')}
      </div>
      <div className={classes.metricsGroup}>

        {metricsContainer(
          t('home_page.metrics_section.heading.years_proven_in_production'),
          t('home_page.metrics_section.subheading.years_proven_in_production'),
          t('home_page.metrics_section.description.years_proven_in_production')
        )}
        {metricsContainer(
          t('home_page.metrics_section.heading.plays_and_counting'),
          t('home_page.metrics_section.subheading.plays_and_counting'),
          t('home_page.metrics_section.description.plays_and_counting')
        )}
        {metricsContainer(
          t('home_page.metrics_section.heading.project_setup_to_building'),
          t('home_page.metrics_section.subheading.project_setup_to_building'),
          t('home_page.metrics_section.description.project_setup_to_building')
        )}
      </div>
    </div>
  )
}

export {HomeMetricsSection}
