import * as React from 'react'
import {Link} from 'react-router-dom'

import {createUseStyles} from 'react-jss'

/* eslint-disable local-rules/hardcoded-copy */
import logoHorizontalWhiteImg from '../static/8th-Wall-Horizontal-Logo-White.svg'
import logoHorizontalPurpleImg from '../static/8th-Wall-Horizontal-Logo-Purple.svg'
/* eslint-enable local-rules/hardcoded-copy */

import logoInfin8PurpleImg from '../static/infin8_Purple.svg'
import logoInfin8WhiteImg from '../static/infin8_White.svg'
import {getPathForMyProjectsPage, getRootPath} from '../common/paths'
import {combine} from '../common/styles'
import {mobileViewOverride} from '../static/styles/settings'
import {useUserHasSession} from '../user/use-current-user'

const LOGO_MAP = {
  wide: {
    purple: logoHorizontalPurpleImg,
    white: logoHorizontalWhiteImg,
  },
  thin: {
    purple: logoInfin8PurpleImg,
    white: logoInfin8WhiteImg,
  },
}

interface INavLogo {
  size?: 'thin' | 'wide'
  color?: 'white' | 'purple'
  className?: string
  a8?: string
}

const useStyles = createUseStyles({
  'navLogo': {
    'display': 'block',
    '& img': {
      'display': 'block',
      'height': '37px',
      'transition': 'height 400ms ease-out',

      '&:hover': {
        opacity: '0.8',
      },
    },
    // TODO (Tri): refactor the sidebar render to pass a prop down to toggle this instead
    '.with-sidebar .page &': {
      display: 'none',
      [mobileViewOverride]: {
        display: 'block',
      },
    },
  },
})

const NavLogo: React.FC<INavLogo> = ({size, color, className, a8}) => {
  const isLoggedIn = useUserHasSession()
  const classes = useStyles()
  const logoMap = LOGO_MAP
  // esline-disable-next-line local-rules/hardcoded-copy
  const contents = <img src={logoMap[size || 'wide'][color || 'purple']} alt='8th Wall Logo' />

  const path = isLoggedIn ? getPathForMyProjectsPage() : getRootPath()

  const fullClassName = combine(classes.navLogo, className)

  return <Link className={fullClassName} to={path} a8={a8}>{contents}</Link>
}

export default NavLogo
