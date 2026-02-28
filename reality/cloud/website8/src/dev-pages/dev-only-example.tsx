import React from 'react'
import {graphql} from 'gatsby'

import Layout from '../components/layouts/layout'

export default () => (
  <Layout title='Dev Only Example'>
    <section>
      <h1>Dev Only Page</h1>
      <p>This page is only accessible in development environments.</p>
      <p>
        Pages still in development can be safely added to the `dev-pages` directory
        without prematurely launching to production. Once a page is ready for production,
        it can be moved into the `pages/` directory, where it will be included in production
        builds.
      </p>
    </section>
  </Layout>
)

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
