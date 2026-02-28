import React from 'react'
import {createUseStyles} from 'react-jss'
import {graphql} from 'gatsby'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import Layout from '../components/layouts/layout'
import BasicPageHeading from '../components/basic-page-heading'
import {combine} from '../styles/classname-utils'
import {MOBILE_VIEW_OVERRIDE} from '../styles/constants'

const useStyles = createUseStyles({
  indent: {
    marginLeft: '1.5rem',
    marginTop: '1.5rem',
  },
  subHeading: {
    '& > h4': {
      marginTop: '1.5rem',
    },
  },
  spaceBelow: {
    marginBottom: '2rem',
  },
  subSection: {
    fontWeight: '700',
  },
  contact: {
    marginTop: '4rem !important',
    [MOBILE_VIEW_OVERRIDE]: {
      marginTop: '1.5rem !important',
    },
  },
  fullText: {
    '& > h4': {
      fontFamily: '\'Noto Sans JP\', sans-serif',
      fontSize: '1.125rem',
      fontWeight: 900,
      marginTop: '1.5rem',
    },
    '& > h1, & > h2': {
      fontFamily: '\'Noto Sans JP\', sans-serif',
      fontSize: '1.5rem',
      fontWeight: 900,
      textAlign: 'center !important',
    },
    '& > h2': {
      marginTop: '1.5rem',
    },
    '& > p:has(strong)': {
      marginTop: '1.5rem',
      marginLeft: '1.5rem',
    },
    '& > ol::marker': {
      fontFamily: '\'Noto Sans JP\', sans-serif',
      fontSize: '1.125rem',
      fontWeight: 900,
    },
  },
})

export default ({data}) => {
  const {i18n} = useTranslation()
  const classes = useStyles()
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
      <BasicPageHeading>{title}</BasicPageHeading>
      <section className='light'>
        <div className='row'>
          <div className={combine('col-md-10 max-width mx-auto text8-md', classes.subHeading)}>
            <div className={classes.fullText} dangerouslySetInnerHTML={{__html: html}} />
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
    copyrightDisputePolicy:
      allMarkdownRemark(
        filter: {fileAbsolutePath: {glob: "**/docs/**/legal/copyright-dispute-policy.md"}},
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
