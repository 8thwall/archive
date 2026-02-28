import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'gatsby-plugin-react-i18next'
import {graphql} from 'gatsby'

import Layout from '../components/layouts/layout'
import {combine} from '../styles/classname-utils'
import {MOBILE_VIEW_OVERRIDE, TABLET_VIEW_OVERRIDE} from '../styles/constants'
import donut404 from '../../img/vids/donut-404.mp4'
import Button8 from '../components/button8'
import IndustryCarousel from '../components/industry-carousel'

const useStyles = createUseStyles({
  video: {
    maxWidth: '464px',
    [TABLET_VIEW_OVERRIDE]: {
      maxWidth: '384px',
    },
    [MOBILE_VIEW_OVERRIDE]: {
      maxWidth: '280px',
    },
  },
  copy: {
    maxWidth: '52ch',
    [MOBILE_VIEW_OVERRIDE]: {
      maxWidth: '32ch',
    },
  },
  button: {
    height: '3.5rem',
    marginTop: '1rem',
    [TABLET_VIEW_OVERRIDE]: {
      marginBottom: '2rem',
    },
    [MOBILE_VIEW_OVERRIDE]: {
      margin: 0,
    },
  },
  videoContainer: {
    zIndex: '-1',
    borderRadius: '10px',
    margin: '-2rem -1rem -2rem 0',
    overflow: 'hidden',
    [MOBILE_VIEW_OVERRIDE]: {
      margin: '-1rem -1rem -1.8rem 0',
    },
  },
})

export default () => {
  const {t} = useTranslation(['404-page'])
  const classes = useStyles()

  return (
    <Layout title={t('page.title')} fromNotFoundPage>
      <section className='pt-0 pb-0'>
        <div
          className={`d-flex flex-column flex-lg-row justify-content-center align-items-center
          flex-column-reverse`}
        >
          <div className={combine(classes.copy, 'text-center text-lg-left')}>
            <h1>{t('page.heading')}</h1>
            <p className='text8-md text-center text-lg-left mb-0'>{t('page.description')}</p>
          </div>
          <div className={classes.videoContainer}>
            <video
              className={classes.video}
              autoPlay
              loop
              muted
              playsInline
              src={donut404}
            />
          </div>
        </div>
      </section>
      <IndustryCarousel />
      <div className='justify-content-center text-center mb-5'>
        <a
          href='/discover'
          a8='click;error-404;click-industry-carousel-explore-all'
        >
          <Button8>{t('button.explore_more')}</Button8>
        </a>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
