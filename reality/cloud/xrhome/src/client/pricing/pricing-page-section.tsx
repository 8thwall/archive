import React from 'react'

import AutoHeading from '../widgets/auto-heading'
import {createThemedStyles} from '../ui/theme'
import {SpaceBetween} from '../ui/layout/space-between'
import {combine} from '../common/styles'
import AutoHeadingScope from '../widgets/auto-heading-scope'
import {hexColorWithAlpha} from '../../shared/colors'
import {mobileViewOverride} from '../static/styles/settings'

const useStyles = createThemedStyles(theme => ({
  pricingPageSection: {
    'position': 'relative',
    'borderRadius': '20px',
    'padding': '1px',
    '--main-bg-solid': hexColorWithAlpha(theme.bgMain, 1),
    '--main-bg-transparent': hexColorWithAlpha(theme.bgMain, 0),
    'background':
      // Border gradient
      'linear-gradient(var(--pricing-page-gradient-color), var(--main-bg-solid))',
  },
  pricingPageSectionContainer: {
    borderRadius: '20px',
    padding: '2em',
    minHeight: '500px',
    background:
      // Inner gradient
      'linear-gradient(var(--main-bg-solid), var(--pricing-page-gradient-color))',
    [mobileViewOverride]: {
      minHeight: 'auto',
    },
  },
  description: {
    fontSize: '1.125em',
    lineHeight: 1.5,
    color: theme.fgMain,
  },
  gray: {
    '--pricing-page-gradient-color': '#19243E',
  },
  blue: {
    '--pricing-page-gradient-color': '#32597B',
  },
  purple: {
    '--pricing-page-gradient-color': '#76327B',
  },
  transparent: {
    padding: 0,
    border: 'none',
    minHeight: 'auto',
    background: 'transparent',
  },
}))

interface IPricingPageSection {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  color?: 'purple' | 'blue' | 'gray' | 'transparent'
  wide?: boolean
  backgroundImage?: string
}

const PricingPageSection: React.FC<IPricingPageSection> = ({
  id, title, description, children, color = 'gray', wide = false, backgroundImage,
}) => {
  const classes = useStyles()

  const style = backgroundImage
    ? {
      background:
        'linear-gradient(var(--main-bg-solid), var(--main-bg-transparent)), ' +
        'linear-gradient(90deg, #000, #FFFFFF00, #FFFFFF00, #000), ' +
        `url('${backgroundImage}') no-repeat 100% / cover`,
    }
    : undefined

  return (
    <section
      id={id}
      className={combine(
        classes.pricingPageSection,
        classes[color]
      )}
    >
      <div
        className={combine(classes.pricingPageSectionContainer,
          color === 'transparent' && classes.transparent)}
        style={style}
      >
        <AutoHeadingScope level={2}>
          <SpaceBetween direction='vertical' centered wide={wide} narrow={!wide}>
            {title && <AutoHeading>{title}</AutoHeading>}
            {description && <p className={classes.description}>{description}</p>}
            {children}
          </SpaceBetween>
        </AutoHeadingScope>
      </div>
    </section>
  )
}

export {PricingPageSection}
