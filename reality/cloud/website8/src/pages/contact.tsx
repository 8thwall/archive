import React from 'react'
import {createUseStyles} from 'react-jss'
import HubspotForm from 'react-hubspot-form'
import {useTranslation} from 'gatsby-plugin-react-i18next'
import {graphql} from 'gatsby'

import Layout from '../components/layouts/layout'
import BasicPageHeading from '../components/basic-page-heading'
import {CONTACT_FORM_MAP} from '../common/hubspot-form-constants'

const useStyles = createUseStyles({
  hubspotForm: {
    maxWidth: '80%',
    margin: '2rem auto 0',
  },
})

export default () => {
  const classes = useStyles()
  const {i18n, t} = useTranslation(['contact-page', 'common'])
  const hubspotFormId = CONTACT_FORM_MAP[i18n.language]

  return (
    <Layout
      title={t('meta.title')}
      description={t('meta.description')}
    >
      <BasicPageHeading>{t('heading.contact_us')}</BasicPageHeading>
      <section className='light'>
        <h2 className='text-center'>{t('heading.get_in_touch')}</h2>
        <div className={classes.hubspotForm}>
          <HubspotForm
            portalId='7182223'
            formId={hubspotFormId}
            loading={<div>{t('hubspot.form.loading_text', {ns: 'common'})}</div>}
          />
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
