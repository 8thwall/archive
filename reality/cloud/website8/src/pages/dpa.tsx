import React from 'react'
import {css} from '@emotion/react'
import {graphql} from 'gatsby'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import HeaderText from '../components/header-text'
import Layout from '../components/layouts/layout'
import {combine} from '../styles/classname-utils'
import * as styles from './dpa.module.scss'

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
  const {title, html} = getData(data.copyrightDisputePolicy)

  return (
    <Layout title={title}>
      <HeaderText text={title} />
      <section>
        <div className={combine('row justify-content-center', styles.container)}>
          <div
            className={combine('col-lg-6 col-sm-12', styles.mainText)}
            dangerouslySetInnerHTML={{__html: html}} />
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
    copyrightDisputePolicy:
      allMarkdownRemark(
        filter: {fileAbsolutePath: {glob: "**/docs/**/legal/dpa.md"}},
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
