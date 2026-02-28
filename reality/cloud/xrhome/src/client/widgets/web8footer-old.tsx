import * as React from 'react'
import {Link} from 'react-router-dom'
import {createUseStyles} from 'react-jss'

import {useTranslation, Trans} from 'react-i18next'

/* eslint-disable local-rules/hardcoded-copy */
import footerLogo from '../static/8th-Wall-Horizontal-Logo-White.svg'
/* eslint-enable local-rules/hardcoded-copy */

import VrArLogo from '../static/VR_AR_logo_1x.png'
import VrArLogoWebp from '../static/VR_AR_logo_1x.webp'
import iABMemberLogo from '../static/iab-member-logo.svg'
import {
  brandBlack, brandWhite, gray1, gray4, gray5, bodySanSerif,
  mobileViewOverride, smallMonitorViewOverride, tinyViewOverride,
} from '../static/styles/settings'
import {LocaleSelection} from './locale-selection'
import {UiThemeProvider} from '../ui/theme'
import {combine} from '../common/styles'
import {CoreLink} from '../ui/components/core-link'
import {useUserHasSession} from '../user/use-current-user'

const useStyles = createUseStyles({
  footer: {
    'fontSize': '16px',
    'backgroundColor': brandBlack,
    'padding': '4rem 2rem',
    'color': brandWhite,
    'fontFamily': bodySanSerif,
    'flexGrow': 1,
    'fontWeight': 400,
    'lineHeight': '1.5em',
    '& p': {
      color: gray4,
    },
    '& a': {
      color: gray1,
    },
    [smallMonitorViewOverride]: {
      padding: '1.5em',
    },
  },
  footerContainer: {
    width: 'calc(100% - 2 * 4rem)',
    maxWidth: '70em',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    [smallMonitorViewOverride]: {
      flexDirection: 'column',
      width: '100%',
      maxWidth: 'none',
      margin: 0,
    },
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginLeft: 0,
    marginRight: 0,
  },
  rowLocale: {
    gap: '1em',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  siteMap: {
    'display': 'grid',
    'gridTemplateColumns': '1fr 1fr 1fr 1fr',
    'justifyContent': 'center',
    'gap': '1rem',

    '& *': {
      padding: 0,
    },
    '& ul': {
      margin: 0,
    },

    '& p': {
      fontSize: '1.2em',
      listStyle: 'none',
      marginBottom: '1em',
    },

    '& li': {
      'listStyle': 'none',
      '&:not(:last-child)': {
        marginBottom: '0.5rem',
      },
    },
    [smallMonitorViewOverride]: {
      marginBottom: '2.5rem',
      gridTemplateColumns: '1fr 1fr',
    },
  },

  siteMapLogo: {
    display: 'inline-block',
    textAlign: 'left',
    minWidth: '9rem',
    margin: 0,
    flex: '0 0 16.666667%',
    maxWidth: '16.666667%',
    [mobileViewOverride]: {
      flex: '0 0 100%',
      maxWidth: '100%',
      marginTop: '2rem',
    },
  },

  footerSocialLinks: {
    'display': 'flex',
    'alignItems': 'center',
    'textAlign': 'left',
    '& p': {
      margin: 0,
    },
    [smallMonitorViewOverride]: {
      width: '100%',
    },
  },

  footerMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  footerLinks: {
    'width': '40rem',
    '& p': {
      'marginBottom': 0,
      '&:not(:last-child)': {
        marginBottom: '0.25rem',
      },
    },
    '& a': {
      whiteSpace: 'nowrap',
    },
    [smallMonitorViewOverride]: {
      width: '100%',
      marginBottom: '2rem',
    },
  },

  copyright: {
    color: 'brand-colors.$gray3',
  },

  footerLogos: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '1rem',
    [smallMonitorViewOverride]: {
      alignItems: 'baseline',
    },
  },
  localeSelector: {
    'minWidth': '12em',
    'marginRight': '1em',
    '& div': {
      backgroundColor: gray5,
      borderRadius: '4px',
    },
  },
})

const FooterOld = () => {
  const {t} = useTranslation(['navigation', 'common'])
  const classes = useStyles()
  const isLoggedIn = useUserHasSession()

  return (
    <section className={classes.footer}>
      <footer className={classes.footerContainer}>
        <div className={classes.siteMapLogo}>
          <img
            src={footerLogo}
            alt='8th Wall Logo'
            style={{
              maxHeight: '2em',
              height: 'auto',
              marginBottom: '2.5rem',
            }}
          />
        </div>

        <div className={classes.footerMain}>
          <div className={classes.siteMap}>
            <div>
              <ul>
                <p>8th Wall</p>
                <li>
                  <a href='https://www.8thwall.com/webar' a8='click;footer;go-to-webar'>
                    {t('web8_footer.link.why_webar')}
                  </a>
                </li>
                <li>
                  <a href='https://www.8thwall.com/products-web' a8='click;footer;go-to-product'>
                    {t('page_footer.link.product')}
                  </a>
                </li>
                <li>
                  <a
                    href='https://www.8thwall.com/products/niantic-studio'
                    a8='click;footer;go-to-niantic-studio'
                  >
                    {t('page_footer.link.niantic_studio')}
                  </a>
                </li>
                <li>
                  <a href='https://www.8thwall.com/pricing' a8='click;footer;go-to-pricing'>
                    {t('page_footer.link.pricing')}
                  </a>
                </li>
                {!isLoggedIn &&
                  <li>
                    <Link to='/login' a8='click;footer;login'>
                      {t('web8_footer.link.login')}
                    </Link>
                  </li>
                }
              </ul>
            </div>

            <div>
              <ul>
                <p>{t('web8_footer.heading.learn')}</p>
                <li>
                  <Link to='/projects' a8='click;footer;go-to-project-library'>
                    {t('web8_footer.link.project_library')}
                  </Link>
                </li>
                <li>
                  <a href='https://www.8thwall.com/discover' a8='click;footer;go-to-discover'>
                    {t('web8_footer.link.discover')}
                  </a>
                </li>
                <li>
                  <a href='https://docs.8thwall.com/' a8='click;footer;go-to-docs'>
                    {t('web8_footer.link.documentation')}
                  </a>
                </li>
                <li>
                  <a href='https://www.8thwall.com/tutorials' a8='click;footer;go-to-tutorials'>
                    {t('web8_footer.link.tutorials')}
                  </a>
                </li>
                <li>
                  <a href='https://github.com/8thwall/web' a8='click;footer;go-to-git-hub'>
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <ul>
                <p>{t('web8_footer.heading.community')}</p>
                <li>
                  <CoreLink
                    href='/forum'
                    newTab
                    a8='click;footer;go-to-forum'
                  >
                    {t('web8_footer.link.forum')}
                  </CoreLink>
                </li>
                <li>
                  <Link to='/blog' a8='click;footer;go-to-blog'>
                    {t('web8_footer.link.blog')}
                  </Link>
                </li>
                <li>
                  <a href='https://8th.io/discord' a8='click-footer;go-to-discord'>
                    {t('web8_footer.link.discord')}
                  </a>
                </li>
                <li>
                  <a href='https://www.8thwall.com/resources' a8='click;footer;go-to-support'>
                    {t('web8_footer.heading.resources')}
                  </a>
                </li>
                <li>
                  <a href='https://nianticlabs.com/security' a8='click;footer;go-to-security'>
                    {t('web8_footer.link.security')}
                  </a>
                </li>
                <li>
                  <a href='/community' a8='click;footer;go-to-community-hub'>
                    {t('web8_footer.link.community_hub')}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <ul>
                <p>{t('web8_footer.heading.company')}</p>
                <li>
                  <a href='https://www.8thwall.com/company' a8='click;footer;go-to-about'>
                    {t('web8_footer.link.about')}
                  </a>
                </li>
                <li>
                  <Link to='/partners' a8='click;footer;go-to-partners'>
                    {t('web8_footer.link.partners')}
                  </Link>
                </li>
                <li>
                  <a href='https://www.8thwall.com/careers' a8='click;footer;go-to-careers'>
                    {t('page_footer.link.careers')}
                  </a>
                </li>
                <li>
                  <a href='https://www.8thwall.com/press' a8='click;footer;go-to-press'>
                    {t('web8_footer.link.press')}
                  </a>
                </li>
                <li>
                  <a href='https://www.8thwall.com/faq' a8='click;footer;go-to-faq'>
                    {t('page_footer.link.faq')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={combine(classes.row, classes.rowLocale)}>
            <div className={classes.localeSelector}>
              <UiThemeProvider mode='dark'>
                <LocaleSelection />
              </UiThemeProvider>
            </div>
            <div className={classes.footerSocialLinks}>
              <p>
                <a href='https://www.youtube.com/8thwall' a8='click;footer;go-to-you-tube'>
                  YouTube
                </a>
                {'  |  '}
                <a href='https://www.facebook.com/the8thwall' a8='click;footer;go-to-facebook'>
                  Facebook
                </a>
                {'  |  '}
                <a href='https://www.instagram.com/8thwall/' a8='click;footer;go-to-instagram'>
                  Instagram
                </a>
                {'  |  '}
                <a
                  href='https://www.linkedin.com/company/8thwall/'
                  a8='click;footer;go-to-linked-in'
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </div>

          <div className={classes.row}>
            <div className={classes.footerLinks}>
              <p className={classes.copyright}>{t('web8_footer.copyright')}</p>
              <p className='text8-xs'>
                <Trans
                  ns='navigation'
                  i18nKey='page_footer.terms_conditions_privacy_copyright'
                >
                  {'Our '}
                  <a href='https://www.8thwall.com/terms' a8='click;footer;go-to-terms'>
                    Terms &amp; Conditions
                  </a>
                  {', '}
                  <a
                    href='https://www.8thwall.com/privacy'
                    a8='click;footer;go-to-privacy'
                  >
                    Privacy Policy
                  </a>{', '}
                  <a
                    href='https://www.8thwall.com/copyright-dispute-policy'
                    a8='click;footer;go-to-copyright-dispute'
                  >
                    Copyright Dispute Policy
                  </a>{', and '}
                  <a
                    href='https://www.8thwall.com/guidelines'
                    a8='click;footer;go-to-content-policy'
                  >
                    Content Guidelines
                  </a>
                </Trans>
              </p>
            </div>
          </div>
        </div>
        <div className={classes.footerLogos}>
          <a
            href='http://www.thevrara.com/'
            target='_blank'
            rel='noreferrer'
            a8='click;footer;go-to-the-vrara'
          >
            <picture>
              <source type='image/webp' srcSet={VrArLogoWebp} />
              <img style={{maxWidth: '10em'}} src={VrArLogo} alt='VR/AR Association member' />
            </picture>
          </a>
          <a
            href='http://www.iab.com/'
            target='_blank'
            rel='noreferrer'
            a8='click;footer;go-to-the-iab'
          ><img style={{maxWidth: '10em'}} src={iABMemberLogo} alt='iAB member' />
          </a>
        </div>
      </footer>
    </section>
  )
}

export {
  FooterOld,
}
