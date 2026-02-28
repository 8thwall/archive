import React from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'

import {createThemedStyles} from '../ui/theme'
import {Icon} from '../ui/components/icon'
import {brand8Purple} from '../ui/colors'
import {useUserHasSession} from '../user/use-current-user'
import {getPathForMyProjectsPage, getPathForSignUp, SignUpPathEnum} from '../common/paths'

const useStyles = createThemedStyles(theme => ({
  button: {
    'position': 'relative',
    'display': 'flex',
    'background': theme.fgMain,
    'borderRadius': '1em',
    'boxShadow': '0 0 0.75em 0 #ffe68980',
    'transition': 'background-image 300ms ease-in-out',
    'overflow': 'hidden',
    '&:hover': {
      'color': theme.fgMain,
      '& $circle': {
        transform: 'scale(1000%)',
      },
      '& $textContainer': {
        'color': theme.fgMain,
        '& svg': {
          color: theme.fgMain,
        },
      },
    },
  },
  textContainer: {
    'display': 'flex',
    'alignItems': 'center',
    'gap': '0.5em',
    'padding': '1em 2em',
    'zIndex': 2,
    'color': theme.bgMain,
    'boxShadow': theme.primaryBtnBoxShadow,
    'transition': 'color 300ms ease-in-out',
    '& svg': {
      transition: 'color 300ms ease-in-out',
    },
  },
  circle: {
    position: 'absolute',
    top: '30%',
    left: '45%',
    height: '20px',
    width: '20px',
    backgroundColor: brand8Purple,
    transition: 'transform 300ms ease-in-out',
    transform: 'scale(0%)',
    borderRadius: '50%',
  },
}))

const CreateForFreeCtaButton: React.FC = () => {
  const classes = useStyles()
  const {t} = useTranslation(['public-featured-pages'])
  const isLoggedIn = useUserHasSession()

  return (
    <Link
      className={classes.button}
      to={isLoggedIn
        ? getPathForMyProjectsPage()
        : getPathForSignUp(SignUpPathEnum.step1Register)
      }
      a8={!isLoggedIn ? 'click;homepage;create-for-free' : undefined}
    >
      <div className={classes.textContainer}>
        <Icon stroke='forwardArrow' />
        {isLoggedIn
          ? t('home_page.hero.button.go_to_my_projects')
          : t('home_page.create_for_free_cta.cta.create_for_free')}
      </div>
      <span className={classes.circle} />
    </Link>
  )
}

export {CreateForFreeCtaButton}
