import React from 'react'

import {mobileViewOverride, tinyViewOverride} from '../static/styles/settings'
import {createThemedStyles} from '../ui/theme'
import {hexColorWithAlpha} from '../../shared/colors'
import {combine} from '../common/styles'

const useStyles = createThemedStyles(theme => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  topDivider: {
    position: 'sticky',
    top: '14em',
    background: theme.bgMain,
    borderTop: `1px solid ${hexColorWithAlpha(theme.fgMain, 0.2)}`,
    padding: '2em 0',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '2em',
    maxWidth: '1600px',
    minHeight: '50vh',
    [mobileViewOverride]: {
      'top': '12em',
      '&:last-child': {
        paddingBottom: 0,
      },
    },
    [tinyViewOverride]: {
      top: '10em',
      flexDirection: 'column-reverse',
      padding: '1em 0',
      gap: '1.5em',
    },
  },
  feature: {
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  mainHeadingContainer: {
    gap: '1em',
  },
  textContainer: {
    gap: '2.5em',
    flex: 1,
    [mobileViewOverride]: {
      gap: '1.5em',
    },
  },
  mainHeading: {
    fontFamily: theme.subHeadingFontFamily,
    fontSize: '1.25em',
    [mobileViewOverride]: {
      fontSize: '1em',
    },
  },
  featureDescription: {
    color: theme.fgMuted,
    [mobileViewOverride]: {
      fontSize: '0.825em',
    },
  },
  image: {
    borderRadius: '0.75em',
    width: '60%',
    [tinyViewOverride]: {
      width: '100%',
    },
  },
  submainHeading: {
    fontFamily: theme.subHeadingFontFamily,
    [mobileViewOverride]: {
      fontSize: '0.825em',
    },
  },
  subFeatureColumn: {
    gap: '1.5em',
    [mobileViewOverride]: {
      gap: '1em',
    },
  },
  subFeatureDescription: {
    [mobileViewOverride]: {
      display: 'none',
    },
  },
}))

interface IHomeEngineAttribute {
  heading: string
  description?: string
}

interface IHomeEngineSlide extends IHomeEngineAttribute{
  imgUrl: string
  imgAlt: string
  attributes: IHomeEngineAttribute[]
}

const HomeEngineSlide: React.FC<IHomeEngineSlide> = ({
  heading, description, imgUrl, imgAlt, attributes,
}) => {
  const classes = useStyles()

  const mainFeature = (
    <div className={combine(classes.column, classes.mainHeadingContainer)}>
      <div className={combine(classes.feature, classes.mainHeading)}>
        {heading}
      </div>
      <div className={combine(classes.feature, classes.featureDescription)}>
        {description}
      </div>
    </div>
  )

  const subFeature = (subHeading: string, subDescription: string) => (
    <div className={classes.column}>
      <div className={combine(classes.feature, classes.submainHeading)}>
        {subHeading}
      </div>
      {subDescription &&
        <div className={combine(classes.feature, classes.featureDescription,
          classes.subFeatureDescription)}
        >
          {subDescription}
        </div>
      }
    </div>
  )

  return (
    <div className={classes.topDivider}>
      <div className={combine(classes.column, classes.textContainer)}>
        {mainFeature}
        <div className={combine(classes.column, classes.subFeatureColumn)}>
          {attributes.map(attribute => subFeature(
            attribute.heading,
            attribute.description
          ))}
        </div>
      </div>
      <img
        className={classes.image}
        alt={imgAlt}
        src={imgUrl}
      />
    </div>
  )
}

export {HomeEngineSlide}
