import * as React from 'react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

/* eslint-disable local-rules/hardcoded-copy */
import footerLogo from '../static/8th-Wall-Horizontal-Logo-White.svg'
/* eslint-enable local-rules/hardcoded-copy */

import {
  mobileViewOverride, smallMonitorViewOverride, tinyViewOverride,
} from '../static/styles/settings'
import {LocaleSelection} from './locale-selection'
import {CoreLink} from '../ui/components/core-link'
import {createThemedStyles} from '../ui/theme'
import {FooterOld} from './web8footer-old'

const useStyles = createThemedStyles(theme => ({
  footer: {
    'fontSize': '14px',
    'backgroundColor': theme.bgMain,
    'padding': '4rem 2rem',
    'color': theme.fgMain,
    'fontFamily': theme.bodyFontFamily,
    'flexGrow': 1,
    'fontWeight': 400,
    'lineHeight': '1.5em',
    '& p': {
      color: theme.footerHeaderColor,
    },
    '& a': {
      color: theme.fgMuted,
    },
    '& a:hover': {
      color: theme.fgMain,
    },
    [smallMonitorViewOverride]: {
      padding: '1.5em',
      marginLeft: '1.5em',
    },
  },
  footerContainer: {
    width: 'calc(100% - 2 * 4rem)',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    gap: '2rem',
    [smallMonitorViewOverride]: {
      width: '100%',
      maxWidth: 'none',
      margin: 0,
    },
  },
  rowLocale: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5em',
    [tinyViewOverride]: {
      flexDirection: 'column',
    },
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  siteMap: {
    'display': 'grid',
    'gridTemplateColumns': '1fr 1fr 1fr 1fr 1fr 1fr',
    'justifyContent': 'center',
    'gap': '1rem',

    '& *': {
      padding: 0,
    },
    '& ul': {
      'fontFamily': theme.headingFontFamily,
      'margin': 0,
    },

    '& p': {
      fontSize: '1.2em',
      listStyle: 'none',
      marginBottom: '0.6em',
    },

    '& li': {
      'fontFamily': theme.subHeadingFontFamily,
      'listStyle': 'none',
      '&:not(:last-child)': {
        marginBottom: '1.1rem',
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
  footerMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  copyright: {
    fontFamily: theme.subHeadingFontFamily,
    color: theme.footerHeaderColor,
  },
  localeSelector: {
    'background': theme.secondaryBtnBg,
    'color': theme.secondaryBtnColor,
    'border': theme.secondaryBtnBorder,
    'borderRadius': theme.roundedBtnSmallBorderRadius,
    'marginRight': '1em',
    'width': 'fit-content',
    'boxShadow': theme.secondaryBtnBoxShadow,
    '&:hover': {
      background: theme.secondaryBtnHoverBg,
    },
  },
}))

const Footer = () => {
  const {t} = useTranslation(['navigation', 'common'])
  const classes = useStyles()

  if (!BuildIf.BRANDING_REFRESH_HOMEPAGE_20251006) {
    return <FooterOld />
  }

  return (
    <section className={classes.footer}>
      <footer className={classes.footerContainer}>
        <div className={classes.siteMapLogo}>
          <img
            src={footerLogo}
            // eslint-disable-next-line local-rules/hardcoded-copy
            alt='8th Wall Logo'
            style={{
              maxHeight: '2em',
              height: 'auto',
            }}
          />
        </div>

        <div className={classes.footerMain}>
          <div className={classes.siteMap}>
            <div>
              <ul>
                <p>{t('web8_footer.heading.product')}</p>
                <li>
                  <a
                    href='https://8th.io/game-engine'
                    a8='click;footer;go-to-game-engine'
                  >
                    {t('web8_footer.link.game_engine')}
                  </a>
                </li>
                <li>
                  <a href='https://8th.io/ar-tooling' a8='click;footer;go-to-ar-tooling'>
                    {t('web8_footer.link.ar_tooling')}
                  </a>
                </li>
                <li>
                  <a href='https://8th.io/ai-tools' a8='click;footer;go-to-ai-tools'>
                    {t('web8_footer.link.ai')}
                  </a>
                </li>
                <li>
                  <a href='https://www.8th.io/export' a8='click;footer;go-to-export'>
                    {t('web8_footer.link.export')}
                  </a>
                </li>
                <li>
                  <a href='https://www.8thwall.com/pricing' a8='click;footer;go-to-pricing'>
                    {t('web8_footer.link.pricing')}
                  </a>
                </li>
                <li>
                  <a href='https://www.8thwall.com/products-web' a8='click;footer;go-to-product'>
                    {t('web8_footer.link.all_features')}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <ul>
                <p>{t('web8_footer.heading.resources')}</p>
                <li>
                  <a href='https://www.8thwall.com/projects' a8='click;footer;go-to-templates'>
                    {t('web8_footer.link.templates')}
                  </a>
                </li>
                <li>
                  <a href='https://docs.8thwall.com/' a8='click;footer;go-to-docs'>
                    {t('web8_footer.link.docs')}
                  </a>
                </li>
                <li>
                  <a href='https://www.8thwall.com/tutorials' a8='click;footer;go-to-tutorials'>
                    {t('web8_footer.link.tutorials')}
                  </a>
                </li>
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
                  <a href='https://www.8thwall.com/download' a8='click;footer;go-to-download'>
                    {t('web8_footer.link.download')}
                  </a>
                </li>
                <li>
                  <a href='https://www.8thwall.com/resources' a8='click;footer;go-to-support'>
                    {t('web8_footer.link.all_resources')}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <p>{t('web8_footer.heading.community')}</p>
              </ul>
              <li>
                <a href='https://8th.io/discord' a8='click-footer;go-to-discord'>
                  {t('web8_footer.link.discord')}
                </a>
              </li>
              <li>
                <a href='https://8th.io/gamejam' a8='click;footer;go-to-game-jam'>
                  {t('web8_footer.link.game_jams')}
                </a>
              </li>
              <li>
                <a href='https://events.8thwall.com/events/#/list' a8='click;footer;go-to-events'>
                  {t('web8_footer.link.events')}
                </a>
              </li>
              <li>
                <a
                  href='https://www.8thwall.com/community/education'
                  a8='click;footer;go-to-education'
                >
                  {t('web8_footer.link.education')}
                </a>
              </li>
              <li>
                <a href='https://www.8thwall.com/community' a8='click;footer;go-to-community'>
                  {t('web8_footer.link.made_by_community')}
                </a>
              </li>
            </div>
            <div>
              <ul>
                <p>{t('web8_footer.heading.for_business')}</p>
              </ul>
              <li>
                <a
                  href='https://www.8thwall.com/industry-solutions'
                  a8='click;footer;go-to-solutions'
                >
                  {t('web8_footer.link.solutions')}
                </a>
              </li>
              <li>
                <a
                  href='https://www.8thwall.com/case-studies'
                  a8='click;footer;go-to-case-studies'
                >
                  {t('web8_footer.link.case_studies')}
                </a>
              </li>
              <li>
                <a href='https://www.8thwall.com/discover' a8='click;footer;go-to-discover'>
                  {t('web8_footer.link.discover')}
                </a>
              </li>
              <li>
                <Link to='/partners' a8='click;footer;go-to-partners'>
                  {t('web8_footer.link.find_a_partner')}
                </Link>
              </li>
              <li>
                <a href='https://www.8thwall.com/custom' a8='click;footer;go-to-custom'>
                  {t('web8_footer.link.contact_sales')}
                </a>
              </li>
            </div>
            <div>
              <ul>
                <p>{t('web8_footer.heading.company')}</p>
              </ul>
              <li>
                <a href='https://www.8thwall.com/company' a8='click;footer;go-to-about'>
                  {t('web8_footer.link.about')}
                </a>
              </li>
              <li>
                <a href='https://www.8thwall.com/terms' a8='click;footer;go-to-terms'>
                  {t('web8_footer.link.terms_of_service')}
                </a>
              </li>
              <li>
                <a
                  href='https://www.8thwall.com/privacy'
                  a8='click;footer;go-to-privacy'
                >
                  {t('web8_footer.link.privacy_policy')}
                </a>
              </li>
              <li>
                <a
                  href='https://www.8thwall.com/copyright-dispute-policy'
                  a8='click;footer;go-to-copyright-dispute'
                >
                  {t('web8_footer.link.copyright_dispute')}
                </a>
              </li>
              <li>
                <a
                  href='https://www.8thwall.com/guidelines'
                  a8='click;footer;go-to-content-policy'
                >
                  {t('web8_footer.link.content_guidelines')}
                </a>
              </li>
              <li>
                <a href='https://nianticlabs.com/security' a8='click;footer;go-to-security'>
                  {t('web8_footer.link.security')}
                </a>
              </li>
            </div>
            <div>
              <ul>
                <p>{t('web8_footer.heading.connect')}</p>
              </ul>
              <li>
                <a
                  href='https://www.linkedin.com/company/8thwall/'
                  a8='click;footer;go-to-linked-in'
                >
                  {t('web8_footer.link.linkedin')}
                </a>
              </li>
              <li>
                <a href='https://8th.io/discord' a8='click-footer;go-to-discord'>
                  {t('web8_footer.link.discord')}
                </a>
              </li>
              <li>
                <a href='https://www.youtube.com/8thwall' a8='click;footer;go-to-you-tube'>
                  {t('web8_footer.link.youtube')}
                </a>
              </li>
              <li>
                <a href='https://www.tiktok.com/@8thwall.ar' a8='click;footer;go-to-tiktok'>
                  {t('web8_footer.link.tiktok')}
                </a>
              </li>
              <li>
                <a href='https://www.instagram.com/8thwall/' a8='click;footer;go-to-instagram'>
                  {t('web8_footer.link.instagram')}
                </a>
              </li>
            </div>
          </div>
        </div>
        <div className={classes.rowLocale}>
          <div className={classes.localeSelector}>
            <LocaleSelection mini />
          </div>
          <p className={classes.copyright}>{t('web8_footer.copyright')}</p>
        </div>
      </footer>
    </section>
  )
}

export {
  Footer,
}
