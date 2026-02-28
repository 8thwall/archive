import React from 'react'
import {useTranslation} from 'react-i18next'
import {createUseStyles} from 'react-jss'

import {
  brandBlack, gray1, mobileViewOverride, tinyViewOverride, headerSanSerif,
} from '../static/styles/settings'
import deployImage from '../static/homepage_service_deploy.svg'
import buildImage from '../static/homepage_service_build.svg'
import prototypeImage from '../static/homepage_service_prototype.svg'

const useStyles = createUseStyles({
  section: {
    display: 'flex',
    gap: '1em',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: '2em',
    [mobileViewOverride]: {
      gap: '0.5em',
    },
    [tinyViewOverride]: {
      padding: '2em 1em',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  serviceContainer: {
    maxWidth: '34em',
    display: 'flex',
    alignItems: 'center',
    gap: '2.5em',
    flex: 1,
    background: gray1,
    padding: '2.5em',
    borderRadius: '1.5em',
    [mobileViewOverride]: {
      flexDirection: 'column',
      gap: '1em',
      padding: '1.75em',
      justifyContent: 'center',
    },
    [tinyViewOverride]: {
      maxWidth: 'unset',
      gap: '1.125em',
    },
  },
  heading: {
    fontFamily: headerSanSerif,
    color: brandBlack,
    fontSize: '1.5em',
    fontWeight: 700,
    marginBottom: '0.5em',
    [mobileViewOverride]: {
      textAlign: 'center',
      lineHeight: '1.25em',
      fontSize: '1.25em',
    },
  },
  description: {
    color: brandBlack,
    lineHeight: '1.125em',
    [mobileViewOverride]: {
      textAlign: 'center',
    },
  },
  image: {
    width: '56px',
    height: '56px',
  },
})

const HomeServiceSection: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation('public-featured-pages')

  const serviceContainer = (
    imageURL: string,
    heading: string,
    description: string
  ) => (
    <div className={classes.serviceContainer}>
      <img
        className={classes.image}
        alt={heading}
        src={imageURL}
      />
      <div>
        <div className={classes.heading}>
          {heading}
        </div>
        <div className={classes.description}>
          {description}
        </div>
      </div>
    </div>
  )

  return (
    <div className={classes.section}>
      {serviceContainer(
        prototypeImage,
        t('home_page.service_section.heading.prototype_ship'),
        t('home_page.service_section.description.prototype_ship')
      )}
      {serviceContainer(
        buildImage,
        t('home_page.service_section.heading.build_3d_xr'),
        t('home_page.service_section.description.build_3d_xr')
      )}
      {serviceContainer(
        deployImage,
        t('home_page.service_section.heading.deploy_web_native'),
        t('home_page.service_section.description.deploy_web_native')
      )}
    </div>
  )
}

export {HomeServiceSection}
