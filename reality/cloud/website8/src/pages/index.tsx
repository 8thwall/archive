import React from 'react'
import {graphql} from 'gatsby'

import Layout from '../components/layouts/layout'

import SocialProofSection from '../components/social-proof-section'
import * as classes from './index.module.scss'

export const ARSolutionHighlight = ({img, description}) => (
  <div className={classes.solutionhighlight}>
    <img
      src={img}
      className='img-fluid text-center'
      style={{marginBottom: '1em'}}
      alt='AR Solution Icon'
    />
    <p className='noto-sans-jp font8-black text8-lg'>
      {description}
    </p>
  </div>
)

const MainContent = () => (
  <SocialProofSection fadeIn a8='click;click-start-free-cta;secondary-start-free-cta' />
)

export default () => (
  <Layout
    title='The World’s Leading WebAR Development Platform'
    description='8th Wall’s platform offers a complete set of tools to create interactive web-based augmented reality — no app required. Start developing today!'
    a8='scroll;homepage;scrolling'
  >
    <MainContent />
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
