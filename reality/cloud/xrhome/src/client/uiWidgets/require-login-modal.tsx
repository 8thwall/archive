import * as React from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'

import loginToContinueImg from '../static/login_to_continue.png'
import {
  // brandHighlight, brandPurple, brandPurpleDark, brandWhite, gray2,
  tinyViewOverride,
} from '../static/styles/settings'
import {getPathForLoginPage, getPathForSignUp, SignUpPathEnum} from '../common/paths'
import {combine} from '../common/styles'
import {StandardModal} from '../ui/components/standard-modal'
import {createThemedStyles} from '../ui/theme'

const useStyles = createThemedStyles(theme => ({
  modalContainer: {
    maxWidth: '35em',
    padding: '3em',
    [tinyViewOverride]: {
      padding: '2em',
    },
  },
  imageContainer: {
    background: '#FBF6FF',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '8px',
  },
  image: {
    height: '13.5em',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
    alignItems: 'center',
    margin: '3em 0',
    textAlign: 'center',
    [tinyViewOverride]: {
      margin: '2em 0',
    },
  },
  heading: {
    fontFamily: theme.headingFontFamily,
    margin: 0,
  },
  description: {
    margin: 0,
    fontSize: '1.25em',
  },
  buttonTray: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1em',
  },
  button: {
    borderRadius: '6px',
    flex: 1,
    padding: '1em',
    textAlign: 'center',
    fontWeight: 600,
  },
  loginBtn: {
    'background': theme.primaryBtnBg,
    'boxShadow': theme.primaryBtnBoxShadow,
    'color': theme.primaryBtnFg,
    '&:hover': {
      color: theme.primaryBtnFg,
      background: theme.primaryBtnHoverBg,
    },
  },
  freeTrialBtn: {
    'background': theme.secondaryBtnBg,
    'color': theme.secondaryBtnColor,
    'border': theme.secondaryBtnBorder,
    'boxShadow': theme.secondaryBtnBoxShadow,
    '& > $secondaryButtonContent': {
      filter: theme.secondaryBtnContentFilter,
    },
    '&:hover': {
      background: theme.secondaryBtnHoverBg,
      color: theme.secondaryBtnColor,
    },
  },
}))

interface IA8Data {
  event: string
  category: string
  action: string
  appName: string
}

type LoginModalVariant = 'project' | 'module'

interface IRequireLoginModal {
  trigger: React.ReactElement
  type: LoginModalVariant
  a8Data?: IA8Data
  redirectTo: string
}

const RequireLoginModal: React.FunctionComponent<IRequireLoginModal> =
  ({trigger, type = 'project', a8Data, redirectTo}) => {
    const classes = useStyles()
    const {t} = useTranslation(['public-featured-pages', 'navigation'])
    const {event, category, action, appName} = a8Data || {}
    const encodedRedirectTo = `redirectTo=${encodeURIComponent(redirectTo)}`

    return (
      <StandardModal trigger={trigger}>
        {() => (
          <div className={classes.modalContainer}>
            <div className={classes.imageContainer}>
              <img
                draggable={false}
                className={classes.image}
                alt={t('require_login_modal.graphic.alt', {ns: 'public-featured-pages'})}
                src={loginToContinueImg}
              />
            </div>
            <div className={classes.textContainer}>
              <h2 className={classes.heading}>
                {t('require_login_modal.heading', {ns: 'public-featured-pages'})}
              </h2>
              <p className={classes.description}>
                {type === 'project'
                  ? t('require_login_modal.description_project', {ns: 'public-featured-pages'})
                  : t('require_login_modal.description_module', {ns: 'public-featured-pages'})
            }
              </p>
            </div>
            <div className={classes.buttonTray}>
              <Link
                className={combine(classes.button, classes.freeTrialBtn)}
                to={getPathForSignUp(SignUpPathEnum.step1Register)}
                a8={a8Data && `${event};${category};${action}-click-get-started-cta-${appName}`}
              >
                {t('logged_out_page_header.link.get_started', {ns: 'navigation'})}
              </Link>
              <Link
                className={combine(classes.button, classes.loginBtn)}
                to={`${getPathForLoginPage()}?${encodedRedirectTo}`}
                a8={a8Data && `${event};${category};${action}-click-login-${appName}`}
              >{t('logged_out_page_header.link.login', {ns: 'navigation'})}
              </Link>
            </div>
          </div>
        ) }
      </StandardModal>
    )
  }

export {RequireLoginModal}
