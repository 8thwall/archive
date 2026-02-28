import React from 'react'
import {useTranslation} from 'react-i18next'

import {mobileViewOverride, tinyViewOverride} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'
import studioGraphicURL from '../static/pricing_page_custom_background.png'
import {combine} from '../common/styles'
import {HomeEngineSlide} from './home-engine-slide'

const useStyles = createThemedStyles(theme => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    padding: '2.5em 2em',
    fontSize: '16px',
    textAlign: 'center',
    alignItems: 'center',
    [mobileViewOverride]: {
      padding: '1.75em 1em',
    },
  },
  headingContainer: {
    gap: '1.5em',
    alignItems: 'center',
    marginBottom: '2em',
    position: 'sticky',
    top: '6em',
    [mobileViewOverride]: {
      gap: '0.5em',
      marginBottom: '1em',
      top: '5.5em',
    },
  },
  heading: {
    color: theme.fgMain,
    fontFamily: theme.headingFontFamily,
    fontSize: '3.5em',
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: '1em',
    [tinyViewOverride]: {
      fontSize: '1.5em',
    },
  },
  subheading: {
    fontFamily: theme.subHeadingFontFamily,
    color: theme.fgMuted,
    [tinyViewOverride]: {
      fontSize: '0.825em',
    },
  },
}))

const HomeEngineSection = () => {
  const {t} = useTranslation(['public-featured-pages'])
  const classes = useStyles()

  const slides = [
    {
      heading: t('home_page.engine_section.heading.build_visually'),
      description: t('home_page.engine_section.description.build_visually'),
      imgUrl: studioGraphicURL,
      imgAlt: t('home_page.engine_section.heading.build_visually'),
      attributes: [
        {
          heading: t('home_page.engine_section.heading.real_time_collaboration'),
          description: t('home_page.engine_section.description.real_time_collaboration'),
        },
        {
          heading: t('home_page.engine_section.heading.visual_code'),
          description: t('home_page.engine_section.description.visual_code'),
        },
        {
          heading: t('home_page.engine_section.heading.build_where_you_work'),
          description: t('home_page.engine_section.description.build_where_you_work'),
        },
        {
          heading: t('home_page.engine_section.heading.editable_live_play'),
          description: t('home_page.engine_section.description.editable_live_play'),
        },
      ],
    },
    {
      heading: t('home_page.engine_section.heading.power_your_build'),
      description: t('home_page.engine_section.description.power_your_build'),
      imgUrl: studioGraphicURL,
      imgAlt: t('home_page.engine_section.heading.build_visually'),
      attributes: [
        {
          heading: t('home_page.engine_section.heading.real_time_physics'),
        },
        {
          heading: t('home_page.engine_section.heading.camera_lighting_systems'),
        },
        {
          heading: t('home_page.engine_section.heading.scripting_runtime_logic'),
        },
        {
          heading: t('home_page.engine_section.heading.asset_scene_management'),
        },
        {
          heading: t('home_page.engine_section.heading.live_preview_testing'),
        },
        {
          heading: t('home_page.engine_section.heading.ar_ready'),
        },
      ],
    },
    {
      heading: t('home_page.engine_section.heading.accelerate_dev'),
      description: t('home_page.engine_section.description.accelerate_dev'),
      imgUrl: studioGraphicURL,
      imgAlt: t('home_page.engine_section.heading.build_visually'),
      attributes: [
        {
          heading: t('home_page.engine_section.heading.eighth_wall_agent'),
          description: t('home_page.engine_section.description.eighth_wall_agent'),
        },
        {
          heading: t('home_page.engine_section.heading.asset_lab'),
          description: t('home_page.engine_section.description.asset_lab'),
        },
      ],
    },
    {
      heading: t('home_page.engine_section.heading.bring_3d_worlds_ar'),
      description: t('home_page.engine_section.description.bring_3d_worlds_ar'),
      imgUrl: studioGraphicURL,
      imgAlt: t('home_page.engine_section.heading.build_visually'),
      attributes: [
        {
          heading: t('home_page.engine_section.heading.world_effects'),
          description: t('home_page.engine_section.description.world_effects'),
        },
        {
          heading: t('home_page.engine_section.heading.image_targets'),
          description: t('home_page.engine_section.description.image_targets'),
        },
        {
          heading: t('home_page.engine_section.heading.face_effects'),
          description: t('home_page.engine_section.description.face_effects'),
        },
        {
          heading: t('home_page.engine_section.heading.location_ar'),
          description: t('home_page.engine_section.description.location_ar'),
        },
      ],
    },
  ]

  return (
    <div className={combine(classes.column, classes.section)}>
      <div className={combine(classes.column, classes.headingContainer)}>
        <div className={classes.heading}>
          {t('home_page.engine_section.main_heading')}
        </div>
        <div className={classes.subheading}>
          {t('home_page.engine_section.main_subheading')}
        </div>
      </div>
      {slides.map(slide => (
        <HomeEngineSlide
          key={slide.heading}
          heading={slide.heading}
          description={slide.description}
          imgUrl={slide.imgUrl}
          imgAlt={slide.imgAlt}
          attributes={slide.attributes}
        />
      ))}
    </div>
  )
}

export {HomeEngineSection}
