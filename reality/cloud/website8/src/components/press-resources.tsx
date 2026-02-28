import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'

import {gray4, brandBlack} from '../styles/brand-colors'
import {combine} from '../styles/classname-utils'
import {MOBILE_VIEW_OVERRIDE, TABLET_VIEW_OVERRIDE} from '../styles/constants'

const useStyles = createUseStyles({
  container: {
    'maxWidth': '80rem',

    '& p': {
      fontSize: '1.125rem',
    },
    [MOBILE_VIEW_OVERRIDE]: {
      '& p': {
        fontSize: '1rem',
      },
    },
  },

  iconRow: {
    '& > *:not(:last-child)': {
      marginRight: '1.5rem',
    },

    '& > a': {
      color: gray4,
    },

    '& > a:hover': {
      color: brandBlack,
    },
  },

  pressResources: {
    [TABLET_VIEW_OVERRIDE]: {
      paddingLeft: 0,
      paddingRight: 0,
      marginBottom: '2rem',
    },
    [MOBILE_VIEW_OVERRIDE]: {
      marginBottom: '1rem',
    },
  },

  mediaContact: {
    marginBottom: '1rem',
  },

  media: {
    [TABLET_VIEW_OVERRIDE]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
})

const PressResources = () => {
  const {t} = useTranslation(['press-page'])
  const classes = useStyles()

  return (
    <section className='light'>
      <div className={combine(classes.container, 'row justify-content-center mx-auto font8-semibold')}>
        <div className={combine(classes.pressResources, 'col-lg-6')}>
          <h2 className='text-nowrap'>
            {t('heading.press_resources')}
          </h2>
          <p>
            <a
              href='https://drive.google.com/drive/folders/1gGJo5bldnykn57mrgW53YJ-uNLKc3r6l?usp=sharing'
              target='_blank'
              rel='noopener noreferrer'
            >
              <i className='fas fa-arrow-circle-down mr-2' />
              {t('link.download_assets')}
            </a>
          </p>
          <p>
            <a
              href='https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing'
              target='_blank'
              rel='noopener noreferrer'
            >
              <i className='fas fa-arrow-circle-down mr-2' />
              {t('link.download_branding')}
            </a>
          </p>
          <p>
            <a
              href='https://drive.google.com/drive/folders/1b-Q-ue2jx0WGPzb9ZLpDyOTKcAkCHVoh?usp=sharing'
              target='_blank'
              rel='noopener noreferrer'
            >
              <i className='fas fa-arrow-circle-down mr-2' />
              {t('link.download_press_kit')}
            </a>
          </p>
          <p>
            <Trans
              ns='press-page'
              i18nKey='link.contact_press'
            >
              For press inquiries, please contact{' '}
              <a href='mailto:press@8thwall.com'>press@8thwall.com</a>
            </Trans>
          </p>
        </div>
        <div className={combine(classes.media, 'col-lg-5')}>
          <div className='row'>
            <div className={combine(classes.mediaContact, 'col')}>
              <h2 className='text-nowrap'>
                {t('heading.media_contact')}
              </h2>
              <p>
                <a href='mailto:press@8thwall.com'>press@8thwall.com</a>
              </p>
              <p>650-263-1144</p>
            </div>
            <div className='col'>
              <h2 className='text-nowrap'>
                {t('heading.follow_us')}
                <p className={combine(classes.iconRow, 'mt-3')}>
                  <a
                    href='https://twitter.com/the8thwall'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className='fab fa-twitter-square fa-2x' />
                  </a>
                  <a
                    href='https://www.linkedin.com/company/8thwall'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className='fab fa-linkedin fa-2x' />
                  </a>
                  <a
                    href='https://www.facebook.com/the8thwall  '
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className='fab fa-facebook-square fa-2x' />
                  </a>
                  <a
                    href='https://www.youtube.com/8thwall'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className='fab fa-youtube fa-2x' />
                  </a>
                </p>
              </h2>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PressResources
