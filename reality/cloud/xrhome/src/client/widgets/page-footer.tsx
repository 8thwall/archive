import * as React from 'react'
import {useTranslation, Trans} from 'react-i18next'
import {Link} from 'react-router-dom'
import {createUseStyles} from 'react-jss'

import logoImgSmall from '../static/infin8_gray2.svg'
import {LocaleSelection} from './locale-selection'
import {gray2, gray3, gray4, mobileViewOverride} from '../static/styles/settings'
import {combine} from '../common/styles'

const NBSP_CHAR = '\xa0'

const LINK_DIVIDER = `${NBSP_CHAR}| `

const useStyles = createUseStyles({
  container: {
    'display': 'flex',
    'flexDirection': 'column',
    'flex': '0 0 auto',
    'color': gray2,
    'lineHeight': '1.75',
    '& div': {
      userSelect: 'text',
    },
    '& a': {
      color: gray3,
    },
    '& a:hover': {
      color: gray4,
    },
  },
  footerLogo: {
    flex: '0 0 auto',
    height: '3.5em',
    marginRight: '1.5em',
    userSelect: 'none',
  },
  pageFooter: {
    display: 'flex',
    flexDirection: 'row',
    [mobileViewOverride]: {
      flexDirection: 'column',
    },
  },
  left: {
    display: 'flex',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    maxWidth: '500px',
    [mobileViewOverride]: {
      maxWidth: 'unset',
      flex: '1 0 0',
    },
  },
  right: {
    flex: '1 0 0',
    marginLeft: '1rem',
    textAlign: 'right',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    [mobileViewOverride]: {
      textAlign: 'left',
      margin: '0',
    },
  },
  selectLocale: {
    marginLeft: '3em',
    width: '12em',
    marginBottom: '2em',
    [mobileViewOverride]: {
      marginTop: '1.5em',
      marginLeft: '0',
      width: '100%',
    },
  },
})

const PageFooter = () => {
  const {t} = useTranslation(['navigation'])
  const classes = useStyles()
  return (
    <footer className={combine(classes.container, 'section centered')}>
      <div className={classes.pageFooter}>
        <div className={classes.left}>
          <img className={classes.footerLogo} src={logoImgSmall} alt='8th Wall Logo' />
          <div>
            <Trans
              ns='navigation'
              i18nKey='page_footer.terms_conditions_privacy_copyright'
            >
              Our <a href='https://www.8thwall.com/terms'>Terms&nbsp;&amp;&nbsp;Conditions</a>{', '}
              <a href='https://www.8thwall.com/privacy'>Privacy&nbsp;Policy</a>{', '}
              <a href='https://www.8thwall.com/copyright-dispute-policy'>
                Copyright&nbsp;Dispute&nbsp;Policy
              </a>{', and '}
              <a href='https://www.8thwall.com/guidelines'>Content&nbsp;Guidelines</a>
            </Trans>
            <br />
            {t('page_footer.all_rights_reserved')}
          </div>
        </div>
        <div className={classes.right}>
          <span className='internal'>
            <a
              href='/forum'
              target='_blank'
              rel='noreferrer'
            >{t('web8_footer.link.forum')}
            </a>
            {LINK_DIVIDER}
            <a href='https://www.8thwall.com/products-web'>{t('page_footer.link.product')}
            </a>{LINK_DIVIDER}
            <a href='https://www.8thwall.com/pricing'>{t('page_footer.link.pricing')}
            </a>{LINK_DIVIDER}
            <Link to='/discover'>{t('page_footer.link.discover')}
            </Link>{LINK_DIVIDER}
            <a href='https://www.8thwall.com/faq'>{t('page_footer.link.faq')}</a>{LINK_DIVIDER}
            <a href='https://www.8thwall.com/careers'>{t('page_footer.link.careers')}</a>
            {LINK_DIVIDER}
            <a href='https://8th.io/discord'>{t('page_footer.link.discord')}</a>
          </span>
          <br />
          <a href='https://www.youtube.com/8thwall'>YouTube</a>{LINK_DIVIDER}
          <a href='https://www.facebook.com/the8thwall'>Facebook</a>{LINK_DIVIDER}
          <a href='https://www.instagram.com/8thwall/'>Instagram</a>{LINK_DIVIDER}
          <a href='https://www.linkedin.com/company/8thwall/'>LinkedIn</a>{LINK_DIVIDER}
          <a href='https://github.com/8thwall/web'>GitHub</a>
        </div>
      </div>
      <div className={classes.selectLocale}>
        <LocaleSelection />
      </div>
    </footer>
  )
}

export default PageFooter
