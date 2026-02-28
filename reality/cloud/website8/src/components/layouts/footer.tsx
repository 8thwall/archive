import React from 'react'
import {Link} from 'gatsby'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'

import footerLogo from '../../../img/8th-Wall-Horizontal-Logo-White.svg'
import VrArLogo from '../../../img/VR_AR_logo_1x.png'
import VrArLogoWebp from '../../../img/VR_AR_logo_1x.webp'
import iABMemberLogo from '../../../img/iab-member-logo.svg'
import {combine} from '../../styles/classname-utils'
import * as classes from './footer.module.scss'
import LocaleSelection from '../locale-selection'
import {useUserContext, IUserContext} from '../../common/user-context'

export default () => {
  const {t} = useTranslation('navigation')
  const {currentUser}: IUserContext = useUserContext()

  return (
    <section className={combine('dark', classes.footer)}>

      <div className={combine('row justify-content-center flex-lg-nowrap mx-0', classes.siteMap)}>
        <div className='col-lg-2 col-12 text-left'>
          <div className={classes.siteMapLogo}>
            <img
              src={footerLogo}
              alt='8th Wall Logo'
              style={{maxHeight: '3em', height: 'auto', marginBottom: '2.5rem'}}
            />
          </div>
        </div>
        <div className='col-lg-auto col-md-3 col-6 mb-4'>
          <ul>
            <p>8th Wall</p>
            <li><Link to='/webar' a8='click;footer;go-to-webar'>{t('footer.link.why_webar')}</Link></li>
            <li><Link to='/products-web' a8='click;footer;go-to-product'>{t('footer.link.product')}</Link></li>
            <li><Link to='/niantic-studio' a8='click;footer;go-to-niantic-studio'>{t('footer.link.niantic_studio')}</Link></li>
            <li><Link to='/pricing' a8='click;footer;go-to-pricing'>{t('footer.link.pricing')}</Link></li>
            {!currentUser && <li><a href='/login' a8='click;footer;login'>{t('footer.link.login')}</a></li>}
          </ul>
        </div>

        <div className='col-lg-auto col-md-3 col-6 mb-4'>
          <ul>
            <p>{t('footer.heading.learn')}</p>
            <li><a href='/projects' a8='click;footer;go-to-project-library'>{t('footer.link.project_library')}</a></li>
            <li><a href='/discover' a8='click;footer;go-to-discovery-hub'>{t('footer.link.discover')}</a></li>
            <li><a href='https://docs.8thwall.com/' a8='click;footer;go-to-docs'>{t('footer.link.documentation')}</a></li>
            <li><Link to='/tutorials' a8='click;footer;go-to-tutorials'>{t('footer.link.tutorials')}</Link></li>
            <li><a href='https://github.com/8thwall/web' a8='click;footer;go-to-git-hub'>GitHub</a></li>
          </ul>
        </div>

        <div className='col-lg-auto col-md-3 col-6 mb-4'>
          <ul>
            <p>{t('footer.heading.community')}</p>
            <li>
              <a
                href='/forum'
                target='_blank'
                rel='noopener noreferrer'
                a8='click;footer;go-to-forum'
              >{t('footer.link.forum')}
              </a>
            </li>
            <li><a href='/blog' a8='click;footer;go-to-blog'>{t('footer.link.blog')}</a></li>
            <li><Link to='/resources' a8='click;footer;go-to-resources'>{t('footer.link.resources')}</Link></li>
            <li>
              <a href='https://nianticlabs.com/security' a8='click;footer;go-to-security'>
                {t('footer.link.security')}
              </a>
            </li>
            <li><Link to='/community' a8='click;footer;go-to-community-hub'>{t('footer.link.community_hub')}</Link></li>
          </ul>
        </div>

        <div className='col-lg-auto col-md-3 col-6 mb-4'>
          <ul>
            <p>{t('footer.heading.company')}</p>
            <li><Link to='/company' a8='click;footer;go-to-about'>{t('footer.link.about')}</Link></li>
            <li>
              <a href='https://www.8thwall.com/partners' a8='click;footer;go-to-partners'>
                {t('footer.link.partners')}
              </a>
            </li>
            <li><Link to='/careers' a8='click;footer;go-to-careers'>{t('footer.link.careers')}</Link></li>
            <li><Link to='/press' a8='click;footer;go-to-press'>{t('footer.link.press')}</Link></li>
            <li><Link to='/faq' a8='click;footer;go-to-faq'>{t('footer.link.faq')}</Link></li>
          </ul>
        </div>

        <div className='col-lg-2 d-lg-block d-none' />
      </div>

      <div className='row justify-content-lg-center flex-column flex-lg-row mx-0'>
        <LocaleSelection />
        <div className={classes.footerSocialLinks}>
          <p>
            <a href='https://www.youtube.com/8thwall' a8='click;footer;go-to-you-tube'>YouTube</a>
            {'  |  '}
            <a
              href='https://www.facebook.com/the8thwall'
              a8='click;footer;go-to-facebook'
            >Facebook
            </a>
            {'  |  '}
            <a
              href='https://www.instagram.com/8thwall/'
              a8='click;footer;go-to-instagram'
            >Instagram
            </a>
            {'  |  '}
            <a
              href='https://www.linkedin.com/company/8thwall/'
              a8='click;footer;go-to-linked-in'
            >LinkedIn
            </a>
          </p>
        </div>
      </div>

      <div className='row justify-content-lg-center mx-0'>
        <div className={classes.footerLinks}>
          <p className={classes.copyright}>{t('footer.copyright')}</p>
          <p className={combine('text8-xs', classes.legalLinks)}>
            <Trans
              ns='navigation'
              i18nKey='footer.terms_conditions_privacy_copyright'
            >
              Our <Link to='/terms' a8='click;footer;go-to-terms'>Terms &amp; Conditions</Link>{', '}
              <Link to='/privacy' a8='click;footer;go-to-privacy'>Privacy Policy</Link>{', '}
              <Link to='/copyright-dispute-policy' a8='click;footer;go-to-copyright-dispute'>
                Copyright Dispute Policy
              </Link>{', and '}
              <Link to='/guidelines' a8='click;footer;go-to-content-policy'>
                Content Guidelines
              </Link>
            </Trans>
          </p>
        </div>
        <div className={combine('col-lg col-sm-12', classes.footerLogos)}>
          <a href='http://www.thevrara.com/' target='_blank' rel='noopener noreferrer' a8='click;footer;go-to-the-vrara'>
            <picture>
              <source type='image/webp' srcSet={VrArLogoWebp} />
              <img style={{maxWidth: '10em'}} src={VrArLogo} alt='VR/AR Association member' />
            </picture>
          </a>
          <a href='http://www.iab.com/' target='_blank' rel='noopener noreferrer' a8='click;footer;go-to-the-iab'>
            <img style={{maxWidth: '10em'}} src={iABMemberLogo} alt='iAB member' />
          </a>
        </div>
      </div>
    </section>
  )
}
