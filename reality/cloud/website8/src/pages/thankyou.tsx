import React from 'react'
import {createUseStyles} from 'react-jss'
import {useTranslation} from 'gatsby-plugin-react-i18next'
import {graphql} from 'gatsby'

import Layout from '../components/layouts/layout'
import {combine} from '../styles/classname-utils'

const useStyles = createUseStyles({
  container: {
    maxWidth: '29rem',
  },
})

const ThankYou = () => {
  const {t} = useTranslation(['thankyou-page'])
  const classes = useStyles()
  return (
    <Layout title={t('page.title')}>
      <section>
        <div className={combine(classes.container, 'mx-auto')}>
          <h2 className='text-center'>{t('page.heading')}</h2>
          <p className='text-center text8-lg font8-semibold'>
            {t('page.description')}
          </p>
        </div>
      </section>
    </Layout>
  )
}

export default ThankYou

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
