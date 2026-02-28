import * as React from 'react'

import {createCustomUseStyles} from '../../common/create-custom-use-styles'
import {
  white, brandBlack, brandGray2, brandGray4, mobileViewOverride, centeredSectionMaxWidth,
} from '../../static/arcade/arcade-settings'
import {hexColorWithAlpha} from '../../../shared/colors'
import {RoundedLinkButton} from '../components/rounded-link-button'
import {BrandLogo} from './brand-logo'

const useStyles = createCustomUseStyles<{isFloating: boolean}>()({
  headerContainer: {
    'display': 'flex',
    'width': `calc(${centeredSectionMaxWidth} + 6rem)`,
    'maxWidth': 'calc(100% - 5rem)',
    'margin': ({isFloating}) => (isFloating ? '0.5rem auto 2rem auto' : '1.5rem auto 2rem auto'),
    'padding': '1rem 1rem 1rem 2rem',
    'alignItems': 'center',
    'gap': '1rem',
    'position': ({isFloating}) => (isFloating ? 'absolute' : 'relative'),
    'left': ({isFloating}) => (isFloating ? '50%' : 'auto'),
    'transform': ({isFloating}) => (isFloating ? 'translateX(-50%)' : 'none'),
    'zIndex': 1,
    'height': '4rem',
    'borderRadius': '2rem',
    'boxSizing': 'border-box',
    'justifyContent': 'space-between',
    'background': hexColorWithAlpha(brandBlack, 0.75),
    'boxShadow':
      `0px 1px 1px 0px ${hexColorWithAlpha(white, 0.30)} inset, ` +
      `0px 0px 0px 1px ${hexColorWithAlpha(white, 0.05)} inset`,
    [mobileViewOverride]: {
      width: 'calc(100% - 2rem)',
      maxWidth: 'unset',
      padding: '0.5rem 0.5rem 0.5rem 1.5rem',
      margin: '1rem auto',
      height: '3rem',
    },
  },
  createForFreeButton: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    [mobileViewOverride]: {
      'padding': '0.5rem 1rem',
    },
  },
  demoBadge: {
    background: brandGray2,
    textTransform: 'capitalize',
    position: 'absolute',
    bottom: '-0.5rem',
    padding: '0.125rem 0.75rem',
    color: brandGray4,
    fontSize: '0.75rem',
    lineHeight: '1rem',
    fontWeight: 'bold',
    borderRadius: '0.125rem',
    zIndex: 1,
  },
})

interface ILoader {
  isFloating?: boolean
}

const PageHeader: React.FC<ILoader> = ({isFloating = false}) => {
  const classes = useStyles({isFloating})
  return (
    <div className={classes.headerContainer}>
      <BrandLogo />
      <RoundedLinkButton
        text='Create for Free'
        href='https://www.8thwall.com/get-started'
        className={classes.createForFreeButton}
        a8='click;hp-nav;click-createforfree'
      />
    </div>
  )
}

export default React.memo(PageHeader)
