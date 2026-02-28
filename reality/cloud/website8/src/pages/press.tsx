import React from 'react'
import {graphql} from 'gatsby'
import Img from 'gatsby-image'
import {useTranslation} from 'gatsby-plugin-react-i18next'

import BasicPageHeading from '../components/basic-page-heading'
import Layout from '../components/layouts/layout'
import * as classes from './press.module.scss'
import {combine} from '../styles/classname-utils'
import PressResources from '../components/press-resources'
import FeaturedInSection from '../components/press/featured-in-section'

export default ({data}) => {
  const {i18n, t} = useTranslation(['press-page'])
  const getData = (queryResult: any): {title: string, image: any, html: string} => {
    const translatedEdge =
      queryResult.edges.find(({node}) => node.fileAbsolutePath.includes(i18n.language))
    const {node} = translatedEdge
    const {title, image} = node.frontmatter
    const {html} = node
    return {title, image, html}
  }

  const arForEveryone = getData(data.arForEveryone)
  const theTech = getData(data.theTech)
  const meetTheFounder = getData(data.meetTheFounder)

  return (
    <Layout title={t('heading.press')}>
      <BasicPageHeading>
        {t('heading.press')}
      </BasicPageHeading>
      <section className='light'>
        <h2 className='text-center'>
          {arForEveryone.title}
        </h2>
        { /* eslint-disable react/no-danger */}
        <div
          className={combine(classes.arForEveryone, classes.maxTabletWidth, 'text8-md max-width mx-auto')}
          dangerouslySetInnerHTML={{__html: arForEveryone.html}}
        />
        <h2 className='text-center'>
          {theTech.title}
        </h2>
        { /* eslint-disable react/no-danger */}
        <div
          className={combine(classes.lastParagraph, classes.maxTabletWidth, 'text8-md max-width mx-auto')}
          dangerouslySetInnerHTML={{__html: theTech.html}}
        />
      </section>
      <section className='gray'>
        <h2 className='text-center'>
          {meetTheFounder.title}
        </h2>
        <div className='row justify-content-center mx-auto max-width'>
          <div>
            <Img
              className={classes.headshot}
              fluid={meetTheFounder.image.childImageSharp.fluid}
              alt={meetTheFounder.title}
              draggable={false}
            />
          </div>
          <div
            className={combine(classes.lastParagraph, classes.maxTabletWidth, 'text8-md')}
            dangerouslySetInnerHTML={{__html: meetTheFounder.html}}
          />
        </div>
      </section>
      <FeaturedInSection />
      <PressResources />
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

    arForEveryone:
      allMarkdownRemark(
        filter: {fileAbsolutePath: {glob: "**/docs/**/press/ar-for-everyone.md"}},
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

    theTech:
      allMarkdownRemark(
        filter: {fileAbsolutePath: {glob: "**/docs/**/press/the-tech.md"}},
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

    meetTheFounder:
      allMarkdownRemark(
        filter: {fileAbsolutePath: {glob: "**/docs/**/press/meet-the-founder.md"}},
      ) {
        edges {
          node {
            fileAbsolutePath
            frontmatter {
              title
              image {
                childImageSharp {
                  fluid(maxWidth: 240, quality: 100, srcSetBreakpoints: [240, 180]) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
            html
          }
        }
      }
  }
`
