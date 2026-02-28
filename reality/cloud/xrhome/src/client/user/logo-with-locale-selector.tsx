import React from 'react'
import {createUseStyles} from 'react-jss'

import NavLogo from '../widgets/nav-logo'
import {LocaleSelection} from '../widgets/locale-selection'
import useQuery from '../common/use-query'
import logoNsp from '../static/niantic-spatial-platform-logo-horizontal.svg'
import {combine} from '../common/styles'
import {mobileViewOverride} from '../static/styles/settings'
import {useUiTheme} from '../ui/theme'

const NIANTIC_SPATIAL_PLATFORM_PARAM = 'nsp'

const useStyles = createUseStyles({
  nspLogo: {
    'display': 'block',
    '& img': {
      'display': 'block',
      'height': '50px',
      '&:hover': {
        opacity: '0.8',
      },
      [mobileViewOverride]: {
        height: '38px',
      },
    },
  },
  hangingLogo: {
    position: 'relative',
    margin: '0 0 2em 0',
    paddingLeft: 0,
  },
  hangingLogoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '1.5rem',  // Reserve space above the content when the logo is fixed-positioned
  },
})

const NspLogo = () => {
  const classes = useStyles()
  return (
    <a
      href='https://nianticspatial.com/augment/studio'
      className={combine(classes.nspLogo, classes.hangingLogo)}
    >
      {/* eslint-disable-next-line local-rules/hardcoded-copy */}
      <img src={logoNsp} alt='Niantic Spatial Platform logo' />
    </a>
  )
}

const LogoWithLocaleSelector: React.FC = () => {
  const classes = useStyles()
  const query = useQuery()
  const nspParam = query.get(NIANTIC_SPATIAL_PLATFORM_PARAM)
  const theme = useUiTheme()

  return (
    <div className={classes.hangingLogoContainer}>
      {nspParam === '1'
        ? <NspLogo />
        : <NavLogo className={classes.hangingLogo} color={theme.navLogoColor} />
      }
      <LocaleSelection mini />
    </div>
  )
}

export default LogoWithLocaleSelector
