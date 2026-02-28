import React from 'react'
import {css} from '@emotion/react'
import {graphql} from 'gatsby'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import HeaderText from '../components/header-text'
import Layout from '../components/layouts/layout'
import * as classes from './toms.module.scss'

export default ({data}) => {
  const {i18n} = useTranslation()
  const getData = (queryResult): {title: string, html: string} => {
    const translatedEdge =
      queryResult.edges.find(({node}) => node.fileAbsolutePath.includes(i18n.language))
    const {node} = translatedEdge
    const {title} = node.frontmatter
    const {html} = node
    return {title, html}
  }
  const {title, html} = getData(data.termsOfService)

  return (
    <Layout title={title}>
      <HeaderText text={title} />
      <section>

        <div className='row justify-content-center' css={css`margin-bottom: 4em;`}>
          <div className='col-lg-6 col-sm-12'>
            <div className={classes.mainText} dangerouslySetInnerHTML={{__html: html}} />
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const query = graphql`
  {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    termsOfService:
      allMarkdownRemark(
        filter: {fileAbsolutePath: {glob: "**/docs/**/legal/toms.md"}},
      ) {
        edges {
          node {
            fileAbsolutePath
            frontmatter {
              title
            }
            html
          }
        }
      }
  }
`
