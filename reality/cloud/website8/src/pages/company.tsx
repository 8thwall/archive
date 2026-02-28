import React from 'react'
import {graphql, Link} from 'gatsby'
import {useTranslation, Trans} from 'gatsby-plugin-react-i18next'

import Layout from '../components/layouts/layout'
import BasicPageHeading from '../components/basic-page-heading'
import Button8 from '../components/button8'

export default () => {
  const {t} = useTranslation(['company-page'])
  return (
    <Layout
      title={t('meta.title')}
      description={t('meta.description')}
    >
      <BasicPageHeading>
        {t('heading.about_us')}
      </BasicPageHeading>

      <section className='light'>
        <div className='row justify-content-center'>
          <div className='col-lg-8 col-md-10 col-sm-12'>
            <p className='text8-md'>
              {t('description')}
            </p>
            {/* TODO(kim): Link is outdated. Please update with new path */}
            <p className='text8-md'>
              <Trans
                ns='company-page'
                i18nKey='blog_cta'
              >
                See how our tools are being used and follow our journey on our <a href='/blog'>blog</a>.
              </Trans>
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className='d-flex justify-content-center align-items-center flex-column'>
          <h2>{t('heading.interested_team')}</h2>
          <Link to='/careers'>
            <Button8>
              {t('button.apply_today')}
            </Button8>
          </Link>
        </div>


      </section>
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
